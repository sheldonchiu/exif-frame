import { ListItem } from 'konsta/react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import MoneyIcon from '../../../icons/money.icon';

const SponsorKakaopayListItem = () => {
  const { t } = useTranslation();
  const { language } = useStore();

  if (language !== 'ko') return null; // Kakaopay is only available in Korea

  return <ListItem media={<MoneyIcon size={26} />} title={t('root.sponsor-kakaopay')} link onClick={() => window.open('https://qr.kakaopay.com/FTG7O8kjL')} />;
};

export default SponsorKakaopayListItem;
