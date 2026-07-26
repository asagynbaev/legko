import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChatCircleText, Compass, Stethoscope, Info } from '@phosphor-icons/react';

interface SpecCardProps {
  icon: React.ReactNode;
  name: string;
  who: string;
  how: string;
  cases: string[];
  noteLabel: string;
  note: string;
}

function SpecCard({ icon, name, who, how, cases, noteLabel, note }: SpecCardProps) {
  return (
    <div className="spec-card">
      <div className="spec-card-head">
        <span className="spec-card-ic">{icon}</span>
        <h2>{name}</h2>
      </div>
      <div className="spec-field">
        <div className="spec-field-label">Кто это</div>
        <p>{who}</p>
      </div>
      <div className="spec-field">
        <div className="spec-field-label">Как работает</div>
        <p>{how}</p>
      </div>
      <div className="spec-field">
        <div className="spec-field-label">С чем можно прийти</div>
        <ul className="spec-list">
          {cases.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
      <div className="callout callout--info">
        <span className="callout-ic"><Info size={20} weight="fill" /></span>
        <span><strong>{noteLabel}:</strong> {note}</span>
      </div>
    </div>
  );
}

export default function SpecialistyPage() {
  return (
    <>
      <Head>
        <title>Психолог, психотерапевт, психиатр — в чём разница? | Legko</title>
        <meta name="description" content="Разбираем разницу между психологом, психотерапевтом и психиатром: кто это, как работают и с какими запросами к кому обращаться. Поможем выбрать своего специалиста." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://legko.live/specialisty" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Психолог, психотерапевт, психиатр — в чём разница?" />
        <meta property="og:description" content="Все они помогают, но по-разному. Разбираем, кто и с какими запросами работает." />
        <meta property="og:url" content="https://legko.live/specialisty" />
        <meta property="og:locale" content="ru_RU" />
      </Head>
      <Header />

      <section className="article-hero">
        <div className="article-wrap">
          <span className="fp-eyebrow"><span className="fp-eyebrow-dot"></span>Полезно знать</span>
          <h1 className="article-title">Психолог, психотерапевт, психиатр — <em>в чём разница?</em></h1>
          <p className="article-lead">
            Когда внутри тяжело, легко запутаться в специалистах. Все они помогают, но делают это совершенно
            по-разному. Давайте разберём разницу раз и навсегда, чтобы вы точно знали, кто подойдёт именно вам.
          </p>
        </div>
      </section>

      <section className="article-body">
        <div className="article-wrap">
          <div className="spec-cards">
            <SpecCard
              icon={<ChatCircleText size={26} />}
              name="Психолог"
              who="Специалист с высшим психологическим образованием. Он не является врачом."
              how="Через диалог, бережные вопросы, поддержку и специальные техники. Помогает вам исследовать себя, свои реакции и поведение."
              cases={[
                'Сложности в отношениях (с партнёром, родителями, коллегами).',
                'Кризисные периоды: развод, смена работы, переезд.',
                'Проблемы с самооценкой, неуверенность в себе.',
                'Прокрастинация, выгорание, трудности с выбором.',
              ]}
              noteLabel="Важно"
              note="Психолог работает со здоровыми людьми, попавшими в сложные жизненные ситуации. Он не ставит диагнозы и не назначает лекарства."
            />

            <SpecCard
              icon={<Compass size={26} />}
              name="Психотерапевт"
              who="Специалист, который заглядывает куда глубже, чем психолог. В нашей реальности психотерапевтом может быть как врач, так и психолог, получивший огромное дополнительное образование."
              how="Помогает найти скрытые причины проблем, изменить жизненные сценарии и справиться с состояниями, которые мешают нормально жить."
              cases={[
                'Длительная тревога, панические атаки, фобии.',
                'Хроническое чувство вины, обиды или одиночества.',
                'Психосоматика (когда от нервов болит тело).',
                'Переживание тяжёлой травмы или утраты.',
              ]}
              noteLabel="Важно"
              note="Психотерапевт работает не просто с конкретным запросом, а с тем, как устроена ваша личность. Если это психотерапевт без медицинского образования, таблетки он не выпишет, но при необходимости направит к коллеге-психиатру."
            />

            <SpecCard
              icon={<Stethoscope size={26} />}
              name="Психиатр"
              who="Врач с высшим медицинским образованием."
              how="Оценивает работу нервной системы и биохимию мозга. Проводит диагностику, ставит официальные диагнозы и лечит с помощью медикаментов."
              cases={[
                'Тяжёлые, затяжные состояния.',
                'Резкие и необъяснимые перепады настроения.',
                'Навязчивые мысли, выраженные нарушения сна, аппетита.',
                'Клинические расстройства.',
              ]}
              noteLabel="Главное правило"
              note="Психиатр — это не страшно. Он не «ставит на учёт» и не превращает в овоща. Он возвращает мозгу химический баланс, чтобы у вас появились силы жить и проходить ту же психотерапию."
            />
          </div>

          <div className="article-cta">
            <h3>Не уверены, кто вам нужен?</h3>
            <p>Расскажите Элли о своей ситуации — она поможет понять запрос и подберёт подходящего специалиста.</p>
            <Link href="/" className="btn btn--primary btn--large">Найти своего психолога</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
