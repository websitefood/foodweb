import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <h1 className="text-4xl font-bold text-center mb-4">
        {t('aboutTitle').split(' ').slice(0,2).join(' ')}<span className="text-primary">Nest</span>
      </h1>
      <p className="text-center text-gray-400 mb-12">
        {t('aboutText')}
      </p>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        <div className="text-center">
          <div className="text-5xl mb-4 text-primary">👩‍🍳</div>
          <h3 className="text-xl font-semibold mb-2">{t('madeWithPassion')}</h3>
          <p className="text-gray-300">{t('madeWithPassionText')}</p>
        </div>
        <div className="text-center">
          <div className="text-5xl mb-4 text-primary">📖</div>
          <h3 className="text-xl font-semibold mb-2">{t('learnAndDiscover')}</h3>
          <p className="text-gray-300">{t('learnAndDiscoverText')}</p>
        </div>
        <div className="text-center">
          <div className="text-5xl mb-4 text-primary">🤝</div>
          <h3 className="text-xl font-semibold mb-2">{t('communityDriven')}</h3>
          <p className="text-gray-300">{t('communityDrivenText')}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
