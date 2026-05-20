function ChainLinkSvg() {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect x="50" y="10" width="60" height="140" rx="30" stroke="currentColor" strokeWidth="12" />
      <rect x="10" y="60" width="140" height="60" rx="30" stroke="currentColor" strokeWidth="12" />
    </svg>
  )
}

export function ChainDecorations() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute bottom-[-80px] right-[-80px] w-[420px] h-[420px] text-chain opacity-40 rotate-12">
        <ChainLinkSvg />
      </div>
      <div className="absolute top-[-100px] left-[-80px] w-[360px] h-[360px] text-chain opacity-25 -rotate-6">
        <ChainLinkSvg />
      </div>
      <div className="absolute top-1/3 right-[-50px] w-[210px] h-[210px] text-chain opacity-15 rotate-6">
        <ChainLinkSvg />
      </div>
    </div>
  )
}
