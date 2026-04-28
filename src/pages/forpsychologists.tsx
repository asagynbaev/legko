import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useRef, ReactNode } from 'react';
import {
  User, GraduationCap, Brain, Briefcase, Sparkle, Paperclip,
  Envelope, Laptop, Lightning, Buildings, CheckCircle, Question,
  UploadSimple, File as FileIcon, Check, ShieldCheck, CaretLeft, CaretRight,
} from '@phosphor-icons/react';

const MAX_FILE_SIZE_MB = 1;
const MAX_TOTAL_FILES = 3;
const MAX_TOTAL_SIZE_MB = 3;

const METHODS = ['КПТ', 'Гештальт', 'EMDR', 'Психоанализ', 'Системная', 'ACT', 'DBT', 'Схема-терапия', 'Экзистенциальная', 'Арт-терапия', 'Телесная', 'Нарративная'];
const TOPICS = ['Тревога', 'Депрессия', 'Отношения', 'Семья/пары', 'Травма/ПТСР', 'Самооценка', 'Выгорание', 'Подростки', 'Дети', 'ЛГБТК+', 'Зависимости', 'Кризисы'];
const PLATFORMS_LIST = ['Zoom', 'Google Meet', 'Skype', 'Telegram', 'WhatsApp'];
const SOURCES = ['Instagram', 'От коллеги', 'Google', 'Telegram', 'Facebook', 'Другое'];

const STEPS: { key: string; title: string; desc: string; icon: ReactNode }[] = [
  { key: 'contact', title: 'Контактные данные', desc: 'Как с вами связаться', icon: <User size={24} /> },
  { key: 'edu', title: 'Образование и опыт', desc: 'Где учились, сколько лет практикуете', icon: <GraduationCap size={24} /> },
  { key: 'practice', title: 'Профессиональная практика', desc: 'Методы, супервизия, личная терапия', icon: <Brain size={24} /> },
  { key: 'work', title: 'Формат работы', desc: 'Онлайн, ставка, специализация', icon: <Briefcase size={24} /> },
  { key: 'about', title: 'О вас и мотивации', desc: 'Запросы, направленность, пожелания', icon: <Sparkle size={24} /> },
  { key: 'docs', title: 'Документы и этика', desc: 'Подтверждение квалификации', icon: <Paperclip size={24} /> },
];

interface FileWithPreview {
  file: File;
  id: string;
}

function ChipMulti({ options, value, onChange, allowCustom, single }: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  allowCustom?: boolean;
  single?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const toggle = (o: string) => {
    if (single) {
      onChange(value.includes(o) ? [] : [o]);
    } else {
      onChange(value.includes(o) ? value.filter(v => v !== o) : [...value, o]);
    }
  };
  const commit = () => {
    const v = draft.trim();
    if (v && !value.includes(v) && !options.includes(v)) onChange([...value, v]);
    setDraft('');
    setAdding(false);
  };
  const custom = value.filter(v => !options.includes(v));

  return (
    <div className="fp-chips">
      {options.map(o => (
        <button key={o} type="button" className={`fp-chip-select ${value.includes(o) ? 'on' : ''}`} onClick={() => toggle(o)}>{o}</button>
      ))}
      {custom.map(o => (
        <button key={o} type="button" className="fp-chip-select on custom" onClick={() => toggle(o)} title="Убрать">{o} ×</button>
      ))}
      {allowCustom && (adding ? (
        <span className="fp-chip-add-wrap">
          <input
            autoFocus
            type="text"
            className="fp-chip-input"
            placeholder="Свой вариант"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
            onBlur={commit}
          />
        </span>
      ) : (
        <button type="button" className="fp-chip-add" onClick={() => setAdding(true)}>+ Свой вариант</button>
      ))}
    </div>
  );
}

function RadioCards({ options, value, onChange }: {
  options: { value: string; title: string; desc?: string; icon?: ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="fp-radio-cards">
      {options.map(o => (
        <button key={o.value} type="button" className={`fp-radio-card ${value === o.value ? 'on' : ''}`} onClick={() => onChange(o.value)}>
          {o.icon && <div className="rc-icon">{o.icon}</div>}
          <div className="rc-title">{o.title}</div>
          {o.desc && <div className="rc-desc">{o.desc}</div>}
        </button>
      ))}
    </div>
  );
}

function Field({ label, hint, required, children, full }: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`fp-field ${full ? 'full' : ''}`}>
      <label className="fp-label">{label}{required && <span className="req">*</span>}</label>
      {hint && <span className="fp-hint">{hint}</span>}
      {children}
    </div>
  );
}

const ForPsychologists = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState({
    email: '', name: '', birth: '', phone: '',
    education: '', experience: '',
    methods: [] as string[], personalTherapy: '', supervision: '', supervisionFreq: '',
    sessionsOnline: '', platforms: [] as string[], rate: '',
    topics: [] as string[], request: '', about: '',
    ethics: '', notes: '', source: '',
    promote: '',
  });

  const update = (patch: Partial<typeof data>) => setData(d => ({ ...d, ...patch }));


  const canNext = () => {
    if (step === 0) return data.email.includes('@') && data.name.trim() && data.phone.replace(/\D/g, '').length >= 9;
    if (step === 1) return data.education.trim() && data.experience;
    return true;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const fileAttachments = await Promise.all(
      files.map(async ({ file }) => ({
        name: file.name,
        data: await fileToBase64(file),
        type: file.type,
      }))
    );

    const sessionFormat = data.sessionsOnline === 'online' ? 'Только онлайн' :
      data.sessionsOnline === 'hybrid' ? 'Онлайн + очно' :
      data.sessionsOnline === 'offline' ? 'Только очно' : '';

    const supervisionText = data.supervision === 'yes'
      ? `Да, регулярно${data.supervisionFreq ? '. ' + data.supervisionFreq : ''}`
      : data.supervision === 'sometimes' ? 'Иногда, по необходимости'
      : data.supervision === 'no' ? 'Нет' : '';

    const ethicsText = data.ethics === 'yes' ? 'Да' : data.ethics === 'discuss' ? 'Нужно обсудить' : '';

    const payload = {
      email: data.email,
      name: data.name,
      birthDate: data.birth,
      phone: '+996 ' + data.phone,
      education: data.education,
      experience: data.experience + ' лет',
      methods: data.methods.join(', '),
      personalTherapyHours: data.personalTherapy,
      supervision: supervisionText,
      socialMediaPromotion: data.promote,
      onlineSessions: sessionFormat,
      service: data.platforms.join(', '),
      hourlyRate: data.rate ? data.rate + ' сом' : '',
      platformGoal: data.request,
      problemsDescription: data.topics.join(', ') + (data.about ? '. ' + data.about : ''),
      ethicsAgreement: ethicsText,
      platformFeedback: data.notes,
      referralSource: data.source,
      files: fileAttachments,
    };

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('Файлы слишком большие. Уменьшите размер или количество прикреплённых файлов.');
        }
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Ошибка отправки');
      }

      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось отправить анкету');
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  const back = () => step > 0 && setStep(step - 1);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    const valid: FileWithPreview[] = [];
    let currentTotalSize = files.reduce((sum, f) => sum + f.file.size, 0);

    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`Файл "${file.name}" превышает ${MAX_FILE_SIZE_MB} МБ`);
        continue;
      }
      if (currentTotalSize + file.size > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
        alert(`Общий размер файлов не должен превышать ${MAX_TOTAL_SIZE_MB} МБ`);
        break;
      }
      currentTotalSize += file.size;
      valid.push({ file, id: `${Date.now()}-${i}` });
    }
    setFiles(prev => [...prev, ...valid].slice(0, MAX_TOTAL_FILES));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => setFiles(files.filter(f => f.id !== id));

  const current = STEPS[step];

  return (
    <>
      <Head>
        <title>Работать с нами | Legko - Платформа для психологов</title>
        <meta name="description" content="Присоединяйтесь к команде профессиональных психологов Legko. Мы найдем вам клиентов, поможем развить личный бренд и возьмем на себя операционные задачи." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      {/* Hero Section */}
      <section className="psychologists-hero">
        <div className="container">
          <div className="psychologists-hero-content">
            <div className="hero-badge">Для психологов</div>
            <h1 className="psychologists-hero-title">
              Сосредоточьтесь на терапии.<br />
              Мы займемся остальным.
            </h1>
            <p className="psychologists-hero-subtitle">
              Находим клиентов, развиваем ваш бренд и берем на себя все организационные задачи. Вы работаете с теми, кому действительно нужна помощь.
            </p>
            <div className="psychologists-hero-actions">
              <Link href="#application-form" className="btn btn--primary btn--large">
                Заполнить анкету
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="psychologists-benefits">
        <div className="container">
          <div className="benefits-header">
            <h2 className="section-title">Что мы делаем</h2>
            <p className="section-description">Мы берем на себя все задачи, которые отвлекают от работы с клиентами</p>
          </div>

          <div className="benefits-grid-modern">
            <div className="benefit-card-modern">
              <div className="benefit-number">01</div>
              <h3>Находим клиентов</h3>
              <p>Занимаемся маркетингом и привлечением новых клиентов. С помощью анкет подбираем тех, чьи запросы соответствуют вашей специализации и методике работы.</p>
            </div>

            <div className="benefit-card-modern">
              <div className="benefit-number">02</div>
              <h3>Развиваем личный бренд</h3>
              <p>Берем на себя продвижение вашего профиля в социальных сетях. Вы можете сосредоточиться на профессиональном развитии.</p>
            </div>

            <div className="benefit-card-modern">
              <div className="benefit-number">03</div>
              <h3>Организуем работу</h3>
              <p>Подбираем время сессий, отправляем напоминания, занимаемся переносами встреч и следим за оплатой. Всегда доступны через Telegram и WhatsApp.</p>
            </div>

            <div className="benefit-card-modern">
              <div className="benefit-number">04</div>
              <h3>Работайте удаленно</h3>
              <p>Не нужно арендовать кабинет. Все сессии проводятся онлайн через Google Meets. Устанавливаете свои часы и дни доступности.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cooperation Process */}
      <section className="cooperation-process" id="cooperation">
        <div className="container">
          <div className="process-header">
            <h2 className="section-title">Как начать</h2>
            <p className="section-description">Три простых шага до начала работы</p>
          </div>

          <div className="process-timeline">
            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="marker-number">1</span>
              </div>
              <div className="timeline-content">
                <h3>Заполните анкету</h3>
                <p>Расскажите о своей специализации, опыте работы и предпочтениях в работе с клиентами</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="marker-number">2</span>
              </div>
              <div className="timeline-content">
                <h3>Пройдите интервью</h3>
                <p>Короткое собеседование для знакомства и обсуждения деталей сотрудничества</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="marker-number">3</span>
              </div>
              <div className="timeline-content">
                <h3>Настройте график</h3>
                <p>Установите часы и дни доступности, и мы начнем подбирать вам клиентов</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements" id="requirements">
        <div className="container">
          <div className="requirements-header">
            <h2 className="section-title">Требования</h2>
            <p className="section-description">Убедитесь, что вы соответствуете нашим стандартам качества</p>
          </div>

          <div className="requirements-grid-modern">
            <div className="requirement-card-modern">
              <h3>Образование</h3>
              <p>Бакалавриат, магистратура или специалитет по психологии. Обучение в психотерапевтических подходах/специализациях.</p>
            </div>

            <div className="requirement-card-modern">
              <h3>Терапия и супервизия</h3>
              <p>Личная терапия не менее года (для всех подходов, кроме КБТ и ОРКТ). Обязательное прохождение супервизии.</p>
            </div>

            <div className="requirement-card-modern">
              <h3>Опыт работы</h3>
              <p>От 2-х лет консультирования в индивидуальном, групповом или семейном формате.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="fp-section" id="application-form">
        <div className="fp-wrap">
          <div className="fp-head">
            <span className="fp-eyebrow"><span className="fp-eyebrow-dot"></span>Анкета</span>
            <h1 className="fp-title">Анкета <em>психолога</em></h1>
            <p className="fp-subtitle">Расскажите о себе — мы подберём клиентов, которые ищут именно ваш подход. Заполнение займёт ~5 минут.</p>
          </div>

          {submitted ? (
            <div className="fp-card">
              <div className="fp-success">
                <div className="fp-success-icon"><CheckCircle size={72} weight="fill" color="var(--accent)" /></div>
                <h2>Спасибо, анкета <em>принята!</em></h2>
                <p>Мы получили вашу заявку. Наша команда внимательно изучит её и свяжется с вами в течение 2 рабочих дней.</p>
                <div className="fp-next-steps">
                  <div className="fp-next-step"><span className="fp-next-step-num">1</span><span>Мы проверим дипломы и сертификаты</span></div>
                  <div className="fp-next-step"><span className="fp-next-step-num">2</span><span>Свяжемся с вами для короткого интервью (~30 мин)</span></div>
                  <div className="fp-next-step"><span className="fp-next-step-num">3</span><span>Поможем оформить профиль и загрузить первых клиентов</span></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="fp-progress">
                <div className="fp-steps-list">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`fp-step-tick ${i < step ? 'done' : i === step ? 'active' : ''}`} />
                  ))}
                </div>
                <span className="fp-step-counter">Шаг {step + 1} / {STEPS.length}</span>
              </div>

              {/* Card */}
              <div className="fp-card" ref={cardRef}>
                <div className="fp-card-head">
                  <div className="fp-card-icon">{current.icon}</div>
                  <div>
                    <h2>{current.title}</h2>
                    <p>{current.desc}</p>
                  </div>
                </div>

                {step === 0 && (
                  <div className="fp-fields">
                    <Field label="Email" required>
                      <div className="fp-input-wrap fp-with-adorn">
                        <span className="fp-adorn"><Envelope size={18} /></span>
                        <input type="email" className="fp-input" placeholder="example@mail.com" value={data.email} onChange={e => update({ email: e.target.value })} />
                      </div>
                    </Field>
                    <Field label="Имя Фамилия" required>
                      <input type="text" className="fp-input" placeholder="Имя Фамилия" value={data.name} onChange={e => update({ name: e.target.value })} />
                    </Field>
                    <Field label="Дата рождения">
                      <input type="date" className="fp-input" value={data.birth} onChange={e => update({ birth: e.target.value })} />
                    </Field>
                    <Field label="Номер телефона" required>
                      <div className="fp-input-wrap fp-with-adorn">
                        <span className="fp-adorn">+996</span>
                        <input
                          type="tel"
                          className="fp-input"
                          placeholder="XXX XX XX XX"
                          value={data.phone}
                          maxLength={12}
                          onChange={e => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                            let formatted = digits;
                            if (digits.length > 3 && digits.length <= 5) {
                              formatted = digits.slice(0, 3) + ' ' + digits.slice(3);
                            } else if (digits.length > 5 && digits.length <= 7) {
                              formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 5) + ' ' + digits.slice(5);
                            } else if (digits.length > 7) {
                              formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 5) + ' ' + digits.slice(5, 7) + ' ' + digits.slice(7);
                            }
                            update({ phone: formatted });
                          }}
                          style={{ paddingLeft: 64 }}
                        />
                      </div>
                    </Field>
                  </div>
                )}

                {step === 1 && (
                  <div className="fp-fields">
                    <Field full label="Ваше образование" hint="Уровень, место обучения, год выпуска, специальность" required>
                      <textarea className="fp-textarea" rows={3} placeholder="Например: Магистратура, КРСУ, 2018, Клиническая психология" value={data.education} onChange={e => update({ education: e.target.value })} />
                    </Field>
                    <Field full label="Опыт работы (лет практики)" required>
                      <ChipMulti
                        options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+']}
                        value={data.experience ? [data.experience] : []}
                        onChange={v => update({ experience: v[v.length - 1] || '' })}
                        single
                      />
                    </Field>
                  </div>
                )}

                {step === 2 && (
                  <div className="fp-fields">
                    <Field full label="Методы, с которыми вы работаете" hint="Выберите все подходящие">
                      <ChipMulti options={METHODS} value={data.methods} onChange={v => update({ methods: v })} allowCustom />
                    </Field>
                    <Field label="Часов личной терапии" hint="Пройдено на данный момент">
                      <input type="text" className="fp-input" placeholder="Например: 200 часов" value={data.personalTherapy} onChange={e => update({ personalTherapy: e.target.value })} />
                    </Field>
                    <Field label="Супервизия">
                      <RadioCards
                        options={[
                          { value: 'yes', title: 'Да', desc: 'Регулярно' },
                          { value: 'sometimes', title: 'Иногда', desc: 'По необходимости' },
                          { value: 'no', title: 'Нет' },
                        ]}
                        value={data.supervision}
                        onChange={v => update({ supervision: v })}
                      />
                    </Field>
                    {data.supervision === 'yes' && (
                      <Field full label="Как часто проходит супервизия">
                        <input type="text" className="fp-input" placeholder="Например: 2 раза в месяц" value={data.supervisionFreq} onChange={e => update({ supervisionFreq: e.target.value })} />
                      </Field>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="fp-fields">
                    <Field full label="Ведёте ли сессии онлайн">
                      <RadioCards
                        options={[
                          { value: 'online', icon: <Laptop size={22} />, title: 'Только онлайн', desc: 'Работаю удалённо' },
                          { value: 'hybrid', icon: <Lightning size={22} />, title: 'Онлайн + очно', desc: 'Оба формата' },
                          { value: 'offline', icon: <Buildings size={22} />, title: 'Только очно', desc: 'Живые встречи' },
                        ]}
                        value={data.sessionsOnline}
                        onChange={v => update({ sessionsOnline: v })}
                      />
                    </Field>
                    {data.sessionsOnline !== 'offline' && data.sessionsOnline && (
                      <Field full label="Какие сервисы используете для онлайн-сессий">
                        <ChipMulti options={PLATFORMS_LIST} value={data.platforms} onChange={v => update({ platforms: v })} />
                      </Field>
                    )}
                    <Field full label="Ваша часовая ставка" hint="В сомах">
                      <input type="text" className="fp-input" placeholder="Например: 3000" value={data.rate} onChange={e => update({ rate: e.target.value })} />
                    </Field>
                    <Field full label="Продвигаете ли услуги в соцсетях">
                      <input type="text" className="fp-input" placeholder="Например: Да, веду Instagram @mypsy" value={data.promote} onChange={e => update({ promote: e.target.value })} />
                    </Field>
                  </div>
                )}

                {step === 4 && (
                  <div className="fp-fields">
                    <Field full label="Темы, с которыми вы работаете" hint="Выберите вашу специализацию">
                      <ChipMulti options={TOPICS} value={data.topics} onChange={v => update({ topics: v })} allowCustom />
                    </Field>
                    <Field full label="Какой запрос вы бы хотели решить с помощью платформы">
                      <textarea className="fp-textarea" rows={3} placeholder="Расскажите, чего вы ожидаете от сотрудничества" value={data.request} onChange={e => update({ request: e.target.value })} />
                    </Field>
                    <Field full label="Опишите основные проблемы, с которыми работаете" hint="И направленность, которая вас больше всего интересует">
                      <textarea className="fp-textarea" rows={4} placeholder="Например: тревожные расстройства, депрессия, семейные конфликты…" value={data.about} onChange={e => update({ about: e.target.value })} />
                    </Field>
                  </div>
                )}

                {step === 5 && (
                  <div className="fp-fields">
                    <Field full label="Готовы ли вы соблюдать профессиональную этику" hint="И работать с клиентами только в её рамках">
                      <RadioCards
                        options={[
                          { value: 'yes', icon: <ShieldCheck size={22} />, title: 'Да, готов(а)', desc: 'Соблюдаю этику' },
                          { value: 'discuss', icon: <Question size={22} />, title: 'Обсудим', desc: 'Есть вопросы' },
                        ]}
                        value={data.ethics}
                        onChange={v => update({ ethics: v })}
                      />
                    </Field>
                    <Field full label="Документы: дипломы, сертификаты, лицензии" hint="До 3 файлов, макс. 1 МБ каждый (всего до 3 МБ) · PDF, JPG, PNG">
                      <label className="fp-upload" htmlFor="fp-files">
                        <div className="fp-up-icon"><UploadSimple size={20} /></div>
                        <div className="fp-up-title">Перетащите файлы или нажмите, чтобы выбрать</div>
                        <div className="fp-up-hint">{files.length > 0 ? `${files.length} файл(ов) выбрано` : 'Прикрепите подтверждающие документы'}</div>
                        <input id="fp-files" ref={fileInputRef} type="file" multiple hidden accept=".pdf,.jpg,.jpeg,.png" onChange={addFiles} />
                      </label>
                      {files.length > 0 && (
                        <div className="fp-file-list">
                          {files.map(({ file, id }) => (
                            <div key={id} className="fp-file-item">
                              <span className="fp-file-icon"><FileIcon size={16} /></span>
                              <span className="fp-file-name">{file.name}</span>
                              <span className="fp-file-size">{(file.size / 1024).toFixed(0)} KB</span>
                              <button type="button" className="fp-file-remove" onClick={() => removeFile(id)}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Field>
                    <Field full label="Откуда вы о нас узнали">
                      <ChipMulti
                        options={SOURCES}
                        value={data.source ? [data.source] : []}
                        onChange={v => update({ source: v[v.length - 1] || '' })}
                        single
                      />
                    </Field>
                    <Field full label="Ваши пожелания, вопросы, комментарии" hint="Необязательно">
                      <textarea className="fp-textarea" rows={3} placeholder="Если есть что добавить…" value={data.notes} onChange={e => update({ notes: e.target.value })} />
                    </Field>
                  </div>
                )}

                {errorMessage && (
                  <div className="fp-error">{errorMessage}</div>
                )}

                <div className="fp-nav">
                  <button type="button" className="fp-btn fp-btn-ghost" onClick={back} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
                    <CaretLeft size={16} weight="bold" /> Назад
                  </button>
                  <button type="button" className="fp-btn fp-btn-primary" onClick={next} disabled={!canNext() || isSubmitting} style={{ opacity: canNext() && !isSubmitting ? 1 : 0.5 }}>
                    {isSubmitting ? 'Отправка...' : step === STEPS.length - 1 ? 'Отправить анкету' : <><span>Далее</span> <CaretRight size={16} weight="bold" /></>}
                  </button>
                </div>
              </div>

              <div className="fp-benefits-rail">
                <span className="fp-benefit-chip"><Check size={14} weight="bold" /> Ответ в течение 2 дней</span>
                <span className="fp-benefit-chip"><Check size={14} weight="bold" /> Проверка бесплатная</span>
                <span className="fp-benefit-chip"><Check size={14} weight="bold" /> Конфиденциально</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="psychologists-contact" id="contact">
        <div className="container">
          <div className="contact-card">
            <h2>Есть вопросы?</h2>
            <p>Напишите нам в Telegram, мы ответим в течение дня</p>
            <a
              href="https://t.me/legko_psychology"
              className="contact-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ForPsychologists;
