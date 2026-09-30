/**
 * Pull the 11-character video ID out of any common YouTube link:
 *   youtube.com/watch?v=ID · youtu.be/ID · youtube.com/shorts/ID
 *   youtube.com/embed/ID · youtube.com/live/ID
 * Shared by the studio (validation) and the site (embed + thumbnail), so both
 * always agree on what counts as a valid link.
 */
export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const match = url
    .trim()
    .match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
  return match ? match[1] : null;
}
