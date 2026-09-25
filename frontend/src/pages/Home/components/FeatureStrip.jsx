import React from 'react';
import { Award, BookOpen, Rocket, ShieldCheck } from 'lucide-react';

function FeatureStrip() {
  const features = [
    {
      icon: Award,
      title: 'All Resources',
      desc: 'In One Place',
      bgColor: 'bg-[#FFEDD5]',
      rotate: 'rotate-[-2.5deg]',
    },
    {
      icon: BookOpen,
      title: 'Learn Smarter',
      desc: 'Not Harder',
      bgColor: 'bg-[#EDE9FE]',
      rotate: 'rotate-[2.5deg]',
    },
    {
      icon: Rocket,
      title: 'Achieve More',
      desc: 'Every Day',
      bgColor: 'bg-[#DCFCE7]',
      rotate: 'rotate-[-2deg]',
    },
    {
      icon: ShieldCheck,
      title: '100% Trusted',
      desc: 'By Students',
      bgColor: 'bg-[#FEF3D6]',
      rotate: 'rotate-[2deg]',
    },
  ];

  return (
    <section className="py-10 md:py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-[#111111] shadow-[5px_5px_0px_#111111]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-4 group ${
                    idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6 lg:pl-8' : ''
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${feat.bgColor} text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] ${feat.rotate} group-hover:rotate-0 group-hover:scale-110 group-hover:shadow-[4px_4px_0px_#111111] transition-all flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-hub-navy leading-tight">{feat.title}</h4>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureStrip;

