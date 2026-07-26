import { useRef, useState, useEffect, ReactNode } from 'react';
import { saveAnketa } from '../lib/anketaBridge';
import {
  ClipboardText, Sparkle, User, UsersThree, Laptop, Buildings,
  Envelope, WhatsappLogo, TelegramLogo, ChatCircleDots, GlobeHemisphereEast,
  CheckCircle, CaretLeft, CaretRight, Check, ArrowLeft,
  Waveform, ShieldWarning, Users, Star, ForkKnife, Wallet, Prohibit,
  Flower, CloudLightning, Fire, Heart, DotsThreeOutline,
} from '@phosphor-icons/react';

/* ---------- Данные анкеты ---------- */

const TOPICS: { label: string; icon: ReactNode }[] = [
  { label: 'Тревога, панические атаки', icon: <Waveform size={20} /> },
  { label: 'Насилие', icon: <ShieldWarning size={20} /> },
  { label: 'Отношения', icon: <Users size={20} /> },
  { label: 'Самооценка', icon: <Star size={20} /> },
  { label: 'Проблемы с питанием (РПП)', icon: <ForkKnife size={20} /> },
  { label: 'Финансы', icon: <Wallet size={20} /> },
  { label: 'Вредные привычки, зависимость', icon: <Prohibit size={20} /> },
  { label: 'Утрата близкого человека', icon: <Flower size={20} /> },
  { label: 'Стресс', icon: <CloudLightning size={20} /> },
  { label: 'Выгорание', icon: <Fire size={20} /> },
  { label: 'Сексуальные отношения', icon: <Heart size={20} /> },
  { label: 'Другое', icon: <DotsThreeOutline size={20} /> },
];
const MAX_TOPICS = 4;

const LANGUAGES = ['Русский', 'Кыргызский', 'Английский'];
const SOURCES = ['Instagram', 'От основателей', 'Через друзей / знакомых', 'Другое'];

const STEPS: { key: string; title: string; desc: string; icon: ReactNode }[] = [
  { key: 'request', title: 'Ваш запрос', desc: 'Что вас беспокоит', icon: <ClipboardText size={20} /> },
  { key: 'format', title: 'Опыт и формат', desc: 'Как вам удобнее', icon: <Sparkle size={20} /> },
  { key: 'about', title: 'О вас', desc: 'Немного о себе', icon: <User size={20} /> },
  { key: 'contacts', title: 'Контакты', desc: 'Как с вами связаться', icon: <ChatCircleDots size={20} /> },
  { key: 'final', title: 'Финал', desc: 'Последние детали', icon: <GlobeHemisphereEast size={20} /> },
];

/* ---------- Мелкие UI-хелперы ---------- */

function TopicChips({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) => {
    if (value.includes(o)) onChange(value.filter(v => v !== o));
    else if (value.length < MAX_TOPICS) onChange([...value, o]);
  };
  return (
    <div className="cf-topics">
      {TOPICS.map(({ label, icon }) => {
        const on = value.includes(label);
        const disabled = !on && value.length >= MAX_TOPICS;
        return (
          <button key={label} type="button" className={`cf-topic ${on ? 'on' : ''}`} onClick={() => toggle(label)} disabled={disabled}>
            <span className="cf-topic-icon">{icon}</span>
            <span className="cf-topic-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function RadioCards({ options, value, onChange, cols }: {
  options: { value: string; title: string; desc?: string; icon?: ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
}) {
  return (
    <div className="fp-radio-cards" style={cols ? { gridTemplateColumns: `repeat(${cols}, 1fr)` } : undefined}>
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
  label: string; hint?: string; required?: boolean; children: ReactNode; full?: boolean;
}) {
  return (
    <div className={`fp-field ${full ? 'full' : ''}`}>
      <label className="fp-label">{label}{required && <span className="req">*</span>}</label>
      {hint && <span className="fp-hint">{hint}</span>}
      {children}
    </div>
  );
}

/* ---------- Основной компонент ---------- */

interface ChatQuestionnaireProps {
  onBack: () => void;
}

export default function ChatQuestionnaire({ onBack }: ChatQuestionnaireProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [data, setData] = useState({
    topics: [] as string[],
    topicOther: '',
    previousTherapy: '',
    format: '',
    consultType: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    messenger: '',
    telegramNick: '',
    language: '',
    source: '',
    sourceOther: '',
  });
  const update = (patch: Partial<typeof data>) => setData(d => ({ ...d, ...patch }));

  useEffect(() => { bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [step, submitted]);

  const hasOther = data.topics.includes('Другое');

  const canNext = () => {
    if (step === 0) return data.topics.length > 0 && (!hasOther || data.topicOther.trim().length > 0);
    if (step === 1) return data.previousTherapy && data.format && data.consultType;
    if (step === 2) return data.name.trim().length > 0 && data.age.trim().length > 0 && data.gender;
    if (step === 3) {
      const phoneOk = data.phone.replace(/\D/g, '').length >= 9;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      const messengerOk = !!data.messenger && (data.messenger !== 'Telegram' || data.telegramNick.trim().length > 0);
      return phoneOk && emailOk && messengerOk;
    }
    if (step === 4) return !!data.language && !!data.source && (data.source !== 'Другое' || data.sourceOther.trim().length > 0);
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      topics: data.topics.join(', '),
      topicOther: data.topicOther,
      previousTherapy: data.previousTherapy,
      format: data.format,
      consultType: data.consultType,
      name: data.name,
      age: data.age,
      gender: data.gender,
      phone: '+996 ' + data.phone,
      email: data.email,
      messenger: data.messenger,
      telegramNick: data.telegramNick,
      language: data.language,
      source: data.source,
      sourceOther: data.sourceOther,
    };

    try {
      const response = await fetch('/api/client-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Ошибка отправки');
      }
      // Сохраняем анкету, чтобы подмешать её в бронь, если клиент забронирует в этой же сессии.
      saveAnketa({
        age: data.age,
        gender: data.gender,
        topics: data.topics,
        topicOther: data.topicOther,
        previousTherapy: data.previousTherapy,
        format: data.format,
        consultType: data.consultType,
        language: data.language,
      });
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось отправить заявку');
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  };
  const back = () => step > 0 && setStep(step - 1);

  const current = STEPS[step];

  return (
    <div className="chatq">
      <div className="chatq-topbar">
        <button type="button" className="chatq-back" onClick={onBack}>
          <ArrowLeft size={16} weight="bold" /> назад к чату
        </button>
        {!submitted && <span className="chatq-counter">Шаг {step + 1} / {STEPS.length}</span>}
      </div>

      {submitted ? (
        <div className="chatq-body chatq-body--center" ref={bodyRef}>
          <div className="chatq-success">
            <CheckCircle size={64} weight="fill" color="var(--accent)" />
            <h3>Спасибо, заявка принята!</h3>
            <p>Мы получили ваши ответы и скоро свяжемся с вами, чтобы предложить подходящих психологов.</p>
            <button type="button" className="fp-btn fp-btn-primary" onClick={onBack}>Вернуться в чат</button>
          </div>
        </div>
      ) : (
        <>
          <div className="chatq-ticks">
            {STEPS.map((_, i) => (
              <div key={i} className={`chatq-tick ${i < step ? 'done' : i === step ? 'active' : ''}`} />
            ))}
          </div>

          <div className="chatq-body" ref={bodyRef}>
            <div className="chatq-head">
              <div className="chatq-head-icon">{current.icon}</div>
              <div>
                <h3>{current.title}</h3>
                <p>{current.desc}</p>
              </div>
            </div>

            {/* Шаг 1 — запрос */}
            {step === 0 && (
              <div className="fp-fields">
                <Field full label="Что вас беспокоит?" hint={`Выберите до ${MAX_TOPICS} тем · выбрано ${data.topics.length}/${MAX_TOPICS}`} required>
                  <TopicChips value={data.topics} onChange={v => update({ topics: v })} />
                </Field>
                {hasOther && (
                  <Field full label="Опишите вашу проблему" required>
                    <textarea className="fp-textarea" rows={3} placeholder="Расскажите подробнее…" value={data.topicOther} onChange={e => update({ topicOther: e.target.value })} />
                  </Field>
                )}
              </div>
            )}

            {/* Шаг 2 — опыт и формат */}
            {step === 1 && (
              <div className="fp-fields">
                <Field full label="Обращались ли вы к психологу раньше?" required>
                  <RadioCards
                    cols={1}
                    options={[
                      { value: 'Да, было пару сессий', title: 'Да, было пару сессий' },
                      { value: 'Находился(лась) в длительной терапии', title: 'Находился(лась) в длительной терапии' },
                      { value: 'Нет', title: 'Нет, впервые' },
                    ]}
                    value={data.previousTherapy}
                    onChange={v => update({ previousTherapy: v })}
                  />
                </Field>
                <Field full label="Какой формат консультации вам подходит?" required>
                  <RadioCards
                    cols={2}
                    options={[
                      { value: 'Онлайн', icon: <Laptop size={22} />, title: 'Онлайн', desc: 'Из дома, по видео' },
                      { value: 'Оффлайн', icon: <Buildings size={22} />, title: 'Оффлайн', desc: 'Личная встреча' },
                    ]}
                    value={data.format}
                    onChange={v => update({ format: v })}
                  />
                </Field>
                <Field full label="Тип консультации" required>
                  <RadioCards
                    cols={2}
                    options={[
                      { value: 'Индивидуальная', icon: <User size={22} />, title: 'Индивидуальная' },
                      { value: 'Парная', icon: <UsersThree size={22} />, title: 'Парная' },
                    ]}
                    value={data.consultType}
                    onChange={v => update({ consultType: v })}
                  />
                </Field>
              </div>
            )}

            {/* Шаг 3 — о вас */}
            {step === 2 && (
              <div className="fp-fields">
                <Field full label="Ваше имя" required>
                  <input type="text" className="fp-input" placeholder="Надира Нургалый" value={data.name} onChange={e => update({ name: e.target.value })} />
                </Field>
                <Field full label="Возраст" required>
                  <input type="number" inputMode="numeric" min={1} max={120} className="fp-input" placeholder="24" value={data.age} onChange={e => update({ age: e.target.value.replace(/\D/g, '').slice(0, 3) })} />
                </Field>
                <Field full label="Пол" required>
                  <RadioCards
                    cols={3}
                    options={[
                      { value: 'Мужской', title: 'М' },
                      { value: 'Женский', title: 'Ж' },
                      { value: 'Другое', title: 'Другое' },
                    ]}
                    value={data.gender}
                    onChange={v => update({ gender: v })}
                  />
                </Field>
              </div>
            )}

            {/* Шаг 4 — контакты */}
            {step === 3 && (
              <div className="fp-fields">
                <Field full label="Телефон" hint="Мы не будем вам звонить!" required>
                  <div className="fp-input-wrap fp-with-adorn">
                    <span className="fp-adorn">+996</span>
                    <input
                      type="tel"
                      className="fp-input"
                      placeholder="XXX XX XX XX"
                      value={data.phone}
                      maxLength={12}
                      style={{ paddingLeft: 64 }}
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
                    />
                  </div>
                </Field>
                <Field full label="Email" required>
                  <div className="fp-input-wrap fp-with-adorn">
                    <span className="fp-adorn"><Envelope size={18} /></span>
                    <input type="email" className="fp-input" placeholder="example@gmail.com" value={data.email} onChange={e => update({ email: e.target.value })} />
                  </div>
                </Field>
                <Field full label="В каком мессенджере удобно общаться?" required>
                  <RadioCards
                    cols={2}
                    options={[
                      { value: 'WhatsApp', icon: <WhatsappLogo size={22} />, title: 'WhatsApp' },
                      { value: 'Telegram', icon: <TelegramLogo size={22} />, title: 'Telegram' },
                    ]}
                    value={data.messenger}
                    onChange={v => update({ messenger: v })}
                  />
                </Field>
                {data.messenger === 'Telegram' && (
                  <Field full label="Ваш никнейм в Telegram" required>
                    <input type="text" className="fp-input" placeholder="@nu_nadi" value={data.telegramNick} onChange={e => update({ telegramNick: e.target.value })} />
                  </Field>
                )}
              </div>
            )}

            {/* Шаг 5 — финал */}
            {step === 4 && (
              <div className="fp-fields">
                <Field full label="На каком языке хотите получить консультацию?" required>
                  <RadioCards cols={3} options={LANGUAGES.map(l => ({ value: l, title: l }))} value={data.language} onChange={v => update({ language: v })} />
                </Field>
                <Field full label="Откуда вы о нас узнали?" required>
                  <RadioCards cols={2} options={SOURCES.map(s => ({ value: s, title: s }))} value={data.source} onChange={v => update({ source: v })} />
                </Field>
                {data.source === 'Другое' && (
                  <Field full label="Укажите, откуда" required>
                    <input type="text" className="fp-input" placeholder="Например: реклама, статья…" value={data.sourceOther} onChange={e => update({ sourceOther: e.target.value })} />
                  </Field>
                )}
              </div>
            )}

            {errorMessage && <div className="fp-error">{errorMessage}</div>}
          </div>

          <div className="chatq-nav">
            <button type="button" className="fp-btn fp-btn-ghost" onClick={back} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
              <CaretLeft size={16} weight="bold" /> Назад
            </button>
            <button type="button" className="fp-btn fp-btn-primary" onClick={next} disabled={!canNext() || isSubmitting} style={{ opacity: canNext() && !isSubmitting ? 1 : 0.5 }}>
              {isSubmitting ? 'Отправка...' : step === STEPS.length - 1 ? <><Check size={16} weight="bold" /> Отправить</> : <><span>Далее</span> <CaretRight size={16} weight="bold" /></>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
