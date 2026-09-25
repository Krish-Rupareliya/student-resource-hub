import React, { useState, useEffect } from 'react';
import { Zap, Play, ArrowRight, Video, X, ExternalLink } from 'lucide-react';
import { NeoBadge } from '../../../components/common/BrandIcons';
import { getPublicHomepageSettings } from '../../../services/settings/settingsApi';
import { parseVideoInfo, getPlatformLabel } from '../../../utils/videoUtils';

const DEFAULT_VIDEO = {
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Student Resource Hub: Product Tour',
  badge: 'PLATFORM PREVIEW',
  description: 'Everything you need to excel in your engineering journey, in one place.',
  thumbnailUrl: '',
};

function VideoSection() {
  const [videoData, setVideoData] = useState(DEFAULT_VIDEO);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadVideoSettings() {
      // Force fresh read to avoid stale cache right after admin edits
      const data = await getPublicHomepageSettings();
      if (data && data.video && isMounted) {
        setVideoData({
          videoUrl: data.video.videoUrl?.trim() || DEFAULT_VIDEO.videoUrl,
          title: data.video.title?.trim() || DEFAULT_VIDEO.title,
          badge: data.video.badge?.trim() || DEFAULT_VIDEO.badge,
          description: data.video.description?.trim() || DEFAULT_VIDEO.description,
          thumbnailUrl: data.video.thumbnailUrl?.trim() || '',
        });
      }
    }
    loadVideoSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const parsedVideo = parseVideoInfo(videoData.videoUrl);
  const platformLabel = getPlatformLabel(parsedVideo.type);

  // Compute thumbnail source
  const getThumbnailSrc = () => {
    if (videoData.thumbnailUrl && !imgError) {
      return videoData.thumbnailUrl;
    }
    if (parsedVideo.type === 'youtube' && !imgError) {
      return parsedVideo.maxResThumbnailUrl || parsedVideo.thumbnailUrl;
    }
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column Text & CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <NeoBadge
                icon={Zap}
                label="EXPLORE IN ACTION"
                bgColor="bg-[#FACC15]"
                textColor="text-[#111111]"
                borderColor="border-[#111111]"
                rotate="rotate-[-2.5deg]"
                shadow="shadow-[3px_3px_0px_#111111]"
              />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight pt-1">
              See how <br />
              <span className="relative inline-block text-amber-500">
                it works
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 0 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
              Take a quick tour of the Student Resource Hub and discover how we empower your academic journey. Everything you need to excel, right at your fingertips.
            </p>

            <div>
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-hub-navy hover:bg-[#111111] text-white font-black px-7 py-3.5 rounded-full border-2 border-[#111111] shadow-[3.5px_3.5px_0px_#FACC15] hover:shadow-[5px_5px_0px_#FACC15] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200 inline-flex items-center justify-center gap-2.5 text-sm sm:text-base group cursor-pointer"
              >
                <span>Watch Full Tour</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Dark Navy Video Card with Yellow Blob Background */}
          <div className="lg:col-span-8 relative">

            {/* Background Yellow Blob behind video card */}
            <div className="absolute -inset-4 bg-amber-400 rounded-[40px] transform rotate-1 scale-105 opacity-90 blur-sm z-0" />

            {/* Video Container Frame */}
            <div className="relative z-10 bg-hub-navy rounded-[32px] overflow-hidden shadow-[8px_8px_0px_#111111] border-3 border-[#111111] group">
              <div className="aspect-video relative bg-slate-950 overflow-hidden">

                {isPlaying ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    {/* 1. YouTube */}
                    {parsedVideo.type === 'youtube' && (
                      <iframe
                        className="w-full h-full"
                        src={parsedVideo.embedUrl}
                        title={videoData.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}

                    {/* 2. Instagram */}
                    {parsedVideo.type === 'instagram' && (
                      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
                        <iframe
                          className="w-full h-full max-w-[540px] border-0"
                          src={parsedVideo.embedUrl}
                          title={videoData.title}
                          allowTransparency="true"
                          allow="encrypted-media; autoplay"
                        />
                      </div>
                    )}

                    {/* 3. Direct Video File (.mp4, .webm) */}
                    {parsedVideo.type === 'direct' && (
                      <video
                        controls
                        autoPlay
                        src={parsedVideo.embedUrl}
                        className="w-full h-full object-contain bg-black"
                      />
                    )}

                    {/* 4. Vimeo or Google Drive */}
                    {(parsedVideo.type === 'vimeo' || parsedVideo.type === 'gdrive') && (
                      <iframe
                        className="w-full h-full"
                        src={parsedVideo.embedUrl}
                        title={videoData.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}

                    {/* 5. Generic or Fallback Link */}
                    {parsedVideo.type === 'generic' && (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                          <Video className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-black">{videoData.title}</h4>
                        <p className="text-xs text-slate-300 max-w-md">{videoData.description}</p>
                        <a
                          href={videoData.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 hover:bg-amber-300 transition-colors shadow-lg cursor-pointer"
                        >
                          <span>Open External Video Tour</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}

                    {/* Close Video overlay button */}
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center border-2 border-white/50 shadow-md cursor-pointer transition-all"
                      title="Close Video"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="relative w-full h-full cursor-pointer select-none"
                  >
                    {/* Video Image Thumbnail / Platform Graphics */}
                    {parsedVideo.type === 'instagram' && !videoData.thumbnailUrl ? (
                      <div className="w-full h-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                        <div className="relative z-10 text-center text-white px-4 space-y-2">
                          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto shadow-xl">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                          <span className="inline-block text-xs font-black tracking-widest uppercase bg-white/25 px-3 py-1 rounded-full border border-white/40">
                            Instagram Video Reel
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img
                        alt={videoData.title}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                        src={getThumbnailSrc()}
                        onError={() => {
                          if (!imgError) {
                            setImgError(true);
                          }
                        }}
                      />
                    )}

                    {/* Ambient dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-hub-navy via-hub-navy/50 to-transparent" />

                    {/* Center Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-amber-400 animate-[spin_14s_linear_infinite] opacity-90" />
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 hover:bg-amber-300 text-[#111111] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#111111] border-2 border-[#111111] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10">
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#111111] stroke-[#111111] translate-x-0.5" />
                        </div>
                        <div className="absolute -top-3 -right-8 bg-[#A3E635] text-[#111111] px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase border-2 border-[#111111] shadow-[3px_3px_0px_#111111] transform rotate-12 flex items-center gap-1 select-none">
                          <span>{platformLabel}</span>
                          <Play className="w-3 h-3 fill-[#111111] stroke-none" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Banner Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div className="space-y-2 max-w-lg">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] rotate-[-1.5deg]">
                          <Video className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{videoData.badge || platformLabel}</span>
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                          {videoData.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-200 line-clamp-2">
                          {videoData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default VideoSection;
