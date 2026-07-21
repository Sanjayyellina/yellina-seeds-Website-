// Floating WhatsApp button — the channel Indian agri actually runs on.
const WA_LINK = `https://wa.me/918341464748?text=${encodeURIComponent('Hi Yellina Seeds, I want to know more about your seeds.')}`

export default function WhatsAppButton() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Yellina Seeds on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-0 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] hover:shadow-[0_14px_36px_-6px_rgba(37,211,102,0.75)] transition-all duration-300 hover:-translate-y-0.5"
    >
      <span className="flex items-center justify-center w-14 h-14 shrink-0">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07a8.1 8.1 0 01-2.39-1.47 8.96 8.96 0 01-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/><path d="M12.05 2a9.9 9.9 0 00-8.4 15.17L2.06 22l4.94-1.55A9.94 9.94 0 1012.05 2zm5.83 15.78a8.25 8.25 0 01-11.66.03 8.25 8.25 0 015.83-14.1 8.26 8.26 0 015.83 14.07z"/></svg>
      </span>
      <span className="max-w-0 group-hover:max-w-[180px] overflow-hidden whitespace-nowrap font-semibold text-[13.5px] transition-all duration-400 group-hover:pr-5">
        Chat on WhatsApp
      </span>
    </a>
  )
}
