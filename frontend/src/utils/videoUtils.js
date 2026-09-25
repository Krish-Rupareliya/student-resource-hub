// src/utils/videoUtils.js
// Universal video parser and embed helper for YouTube, Instagram, Vimeo, and direct video files

/**
 * Parses any video URL and extracts playback parameters, embed targets, and preview metadata.
 * @param {string} rawUrl
 * @returns {{
 *   type: 'youtube' | 'instagram' | 'vimeo' | 'gdrive' | 'direct' | 'generic' | 'empty',
 *   id?: string,
 *   embedUrl: string | null,
 *   thumbnailUrl?: string | null,
 *   maxResThumbnailUrl?: string | null,
 *   originalUrl: string,
 *   isReel?: boolean
 * }}
 */
export function parseVideoInfo(rawUrl) {
  const url = (rawUrl || '').trim();
  if (!url) {
    return {
      type: 'empty',
      embedUrl: null,
      thumbnailUrl: null,
      originalUrl: '',
    };
  }

  // 1. YouTube
  // Matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - https://www.youtube.com/live/VIDEO_ID
  // - 11 character video ID directly
  const ytRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      id: videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      maxResThumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      originalUrl: url,
    };
  }

  // If someone passed just an 11-char YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return {
      type: 'youtube',
      id: url,
      embedUrl: `https://www.youtube-nocookie.com/embed/${url}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${url}/hqdefault.jpg`,
      maxResThumbnailUrl: `https://img.youtube.com/vi/${url}/maxresdefault.jpg`,
      originalUrl: `https://www.youtube.com/watch?v=${url}`,
    };
  }

  // 2. Instagram
  // Matches:
  // - https://www.instagram.com/p/POST_ID/
  // - https://www.instagram.com/reel/REEL_ID/
  // - https://www.instagram.com/tv/TV_ID/
  // - https://instagr.am/p/POST_ID/
  const igRegex = /(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i;
  const igMatch = url.match(igRegex);
  if (igMatch && igMatch[1]) {
    const postId = igMatch[1];
    return {
      type: 'instagram',
      id: postId,
      embedUrl: `https://www.instagram.com/p/${postId}/embed/`,
      thumbnailUrl: null,
      originalUrl: url,
      isReel: url.includes('/reel/'),
    };
  }

  // 3. Vimeo
  // Matches: https://vimeo.com/123456789
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[3]) {
    const vimeoId = vimeoMatch[3];
    return {
      type: 'vimeo',
      id: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      thumbnailUrl: null,
      originalUrl: url,
    };
  }

  // 4. Google Drive
  // Matches: https://drive.google.com/file/d/FILE_ID/view
  const gdriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i;
  const gdriveMatch = url.match(gdriveRegex);
  if (gdriveMatch && gdriveMatch[1]) {
    const fileId = gdriveMatch[1];
    return {
      type: 'gdrive',
      id: fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      thumbnailUrl: null,
      originalUrl: url,
    };
  }

  // 5. Direct Video File (.mp4, .webm, .ogg)
  if (/\.(mp4|webm|ogg)($|\?)/i.test(url)) {
    return {
      type: 'direct',
      id: url,
      embedUrl: url,
      thumbnailUrl: null,
      originalUrl: url,
    };
  }

  // 6. Generic / Other URL
  return {
    type: 'generic',
    id: null,
    embedUrl: url,
    thumbnailUrl: null,
    originalUrl: url,
  };
}

/**
 * Returns human-friendly platform label.
 * @param {string} type
 * @returns {string}
 */
export function getPlatformLabel(type) {
  switch (type) {
    case 'youtube':
      return 'YouTube Video';
    case 'instagram':
      return 'Instagram Post / Reel';
    case 'vimeo':
      return 'Vimeo Video';
    case 'gdrive':
      return 'Google Drive Video';
    case 'direct':
      return 'Direct MP4 / WebM File';
    case 'generic':
      return 'Web Video Link';
    default:
      return 'Video Tour';
  }
}
