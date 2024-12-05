import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: t('en'),
          code:'GB'
        },
        {
          value: 'fa',
          label: t('fa'),
          code:'IR'
        }
      ]}
      label={t('label')}
      className={className||''}
    />
  );
}