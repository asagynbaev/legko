/**
 * Конвертирует документы психологов (дипломы/сертификаты) в web-формат
 * и генерирует маппинг src/data/certificates.ts.
 *
 * Использование:
 *   node scripts/build-certificates.mjs <путь-к-папке-с-подпапками-психологов>
 *
 * Ожидаемая структура входа:
 *   <RAW>/Чолпон Кадралиева/<любые .jpg/.jpeg/.png/.pdf>
 *   <RAW>/Адинай Жапаралиева/...
 *
 * Результат:
 *   public/certificates/<slug>/1.webp, 2.webp, ...   (pdf копируются как есть)
 *   src/data/certificates.ts                         (перегенерируется)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

/** Конвертирует изображение в webp заданного размера/качества.
 *  HEIC и прочее, что не читает sharp, сначала прогоняем через macOS `sips` в PNG. */
async function convert(srcPath, destPath, size, quality) {
  const opts = { width: size, height: size, fit: 'inside', withoutEnlargement: true };
  try {
    await sharp(srcPath).rotate().resize(opts).webp({ quality }).toFile(destPath);
  } catch {
    const tmp = destPath + '.tmp.png';
    execFileSync('sips', ['-s', 'format', 'png', srcPath, '--out', tmp], { stdio: 'ignore' });
    await sharp(tmp).rotate().resize(opts).webp({ quality }).toFile(destPath);
    fs.unlinkSync(tmp);
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RAW = process.argv[2];

if (!RAW || !fs.existsSync(RAW)) {
  console.error('❌ Укажи путь к папке с подпапками психологов:\n   node scripts/build-certificates.mjs "/path/to/folder"');
  process.exit(1);
}

const OUT_PUBLIC = path.join(ROOT, 'public', 'certificates');
const OUT_MAP = path.join(ROOT, 'src', 'data', 'certificates.ts');

/* --- транслитерация RU → latin-kebab для имён папок --- */
const MAP = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'i',к:'k',л:'l',м:'m',
  н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',
  ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
};
function slugify(name) {
  return name.toLowerCase().split('').map((ch) => MAP[ch] ?? ch).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/* --- определяем тип файла по расширению (устойчиво к висячим ")" и мусору) --- */
const EXT_RE = /\.(jpe?g|png|webp|heic|heif|gif|tiff?|pdf)\b/gi;
function detectKind(filename) {
  const m = filename.toLowerCase().match(EXT_RE);
  if (!m) return null;
  const ext = m[m.length - 1].replace('.', '').toLowerCase();
  return ext === 'pdf' ? 'pdf' : 'img';
}

/* --- чистим имя файла в человекочитаемый заголовок (best-effort) --- */
function titleFrom(filename, psychName) {
  let t = filename.normalize('NFC');                  // macOS NFD → NFC
  t = t.replace(EXT_RE, '');                          // убрать расширение (и хвост после него)
  t = t.replace(/\).*$/, '');                         // хвост после закрывающей скобки
  t = t.replace(/^Копия\s*/i, '');                    // "Копия"
  t = t.replace(/^\(+/, '').replace(/\)+$/, '');      // обрамляющие скобки
  t = t.replace(/_tilda\d+/gi, '');                   // tilda-идентификаторы
  t = t.replace(/CamScanner[\s\d\-.:_]*/gi, '');      // CamScanner
  t = t.replace(/\s*\(\d+\)\s*/g, ' ');               // "(1)"
  if (psychName) {
    const esc = psychName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(esc, 'gi'), '');
  }
  // нормализуем любые кавычки в парные « »
  t = t.replace(/[«»""„"]/g, '"');
  let q = 0;
  t = t.replace(/"/g, () => (q++ % 2 === 0 ? '«' : '»'));
  t = t.replace(/\s*«\s*/g, ' «').replace(/\s*»/g, '»');
  t = t.replace(/[_]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  t = t.replace(/\(\s*\d+\s*$/, '').trim();          // висячее "(1"
  t = t.replace(/^[-–—•\s]+|[-–—•\s]+$/g, '').trim();
  // Оставляем подпись, только если она осмысленная (содержит «документные» слова).
  // Иначе (сканы/фото/скриншоты/ID/номера) — без подписи.
  const MEANINGFUL = /сертификат|диплом|курс|семинар|вебинар|терапи|терапевт|конференц|супервизи|повышени|квалификац|экспертиз|интенсив|специализац|магистр|бакалавр|обучени|тренинг|психолог|практик|помощь|коуч|аттестат|свидетельств|удостоверени|справк/i;
  if (!t || !MEANINGFUL.test(t)) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const dirs = fs.readdirSync(RAW, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const mapping = {};
let totalFiles = 0;

for (const psych of dirs) {
  const name = psych.normalize('NFC');          // macOS отдаёт имена в NFD — приводим к NFC
  const slug = slugify(name);
  const srcDir = path.join(RAW, psych);          // для ФС используем оригинальное имя
  const outDir = path.join(OUT_PUBLIC, slug);
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter((f) => detectKind(f) !== null);
  if (files.length === 0) {
    console.log(`· ${name}: файлов нет — пропуск`);
    fs.rmdirSync(outDir, { recursive: true });
    continue;
  }
  // дипломы вперёд, затем сертификаты; внутри — по алфавиту
  files.sort((a, b) => {
    const da = /диплом/i.test(a) ? 0 : 1;
    const db = /диплом/i.test(b) ? 0 : 1;
    return da - db || a.localeCompare(b, 'ru');
  });

  const entries = [];
  let n = 0;
  for (const f of files) {
    n += 1;
    const title = titleFrom(f, name);
    if (detectKind(f) === 'pdf') {
      const dest = `${n}.pdf`;
      fs.copyFileSync(path.join(srcDir, f), path.join(outDir, dest));
      entries.push({ src: `/certificates/${slug}/${dest}`, title });
    } else {
      const src = path.join(srcDir, f);
      await convert(src, path.join(outDir, `${n}.webp`), 1600, 82);   // полное
      await convert(src, path.join(outDir, `${n}t.webp`), 240, 62);   // превью
      entries.push({ src: `/certificates/${slug}/${n}.webp`, thumb: `/certificates/${slug}/${n}t.webp`, title });
    }
    totalFiles += 1;
  }
  mapping[name] = entries;
  console.log(`✓ ${name} (${slug}): ${entries.length} док.`);
}

/* --- генерируем certificates.ts --- */
const body = Object.entries(mapping).map(([name, docs]) => {
  const items = docs.map((d) => {
    const thumb = d.thumb ? `, thumb: ${JSON.stringify(d.thumb)}` : '';
    const title = d.title ? `, title: ${JSON.stringify(d.title)}` : '';
    return `    { src: ${JSON.stringify(d.src)}${thumb}${title} },`;
  }).join('\n');
  return `  ${JSON.stringify(name)}: [\n${items}\n  ],`;
}).join('\n');

const ts = `/**
 * Документы (дипломы, сертификаты) психологов, захостенные на сайте.
 * АВТОГЕНЕРАЦИЯ: scripts/build-certificates.mjs — не редактируй вручную,
 * правь исходники в Drive и перезапусти скрипт (или поправь заголовки точечно).
 *
 * Ключ — имя психолога как в Booka (master.name).
 */

export interface CertificateDoc {
  src: string;
  thumb?: string;
  title?: string;
}

export const CERTIFICATES_BY_NAME: Record<string, CertificateDoc[]> = {
${body}
};

// Канон: нижний регистр, схлопнутые пробелы, слова отсортированы —
// устойчиво к двойным пробелам и обратному порядку имя/фамилия.
function canon(s: string): string {
  return s.normalize('NFC').toLowerCase().split(/\\s+/).filter(Boolean).sort().join(' ');
}
const _byCanon = new Map<string, CertificateDoc[]>();
for (const [k, v] of Object.entries(CERTIFICATES_BY_NAME)) _byCanon.set(canon(k), v);

export function getCertificates(name: string | undefined | null): CertificateDoc[] {
  if (!name) return [];
  return CERTIFICATES_BY_NAME[name] || _byCanon.get(canon(name)) || [];
}
`;

fs.writeFileSync(OUT_MAP, ts, 'utf8');
console.log(`\n✅ Готово: ${dirs.length} психологов, ${totalFiles} файлов.`);
console.log(`   → public/certificates/*`);
console.log(`   → src/data/certificates.ts (перегенерирован)`);
