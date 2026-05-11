import globalBgLandscape from "@/assets/global-bg-landscape.webp";
import globalOrb3d from "@/assets/global-orb-3d.webp";

const GlobalPageBackground = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_580px_at_0%_0%,hsl(var(--primary)/0.12),transparent_56%),radial-gradient(900px_520px_at_100%_12%,hsl(var(--accent)/0.14),transparent_62%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--secondary)/0.3),hsl(var(--background)))]" />

      <img
        src={globalBgLandscape}
        alt=""
        width={1024}
        height={1024}
        loading="eager"
        fetchPriority="low"
        decoding="async"
        className="absolute left-1/2 top-0 h-[60vh] w-[72vw] -translate-x-1/2 object-cover opacity-20 blur-[1px]"
      />

      <img
        src={globalOrb3d}
        alt=""
        width={1024}
        height={1024}
        loading="lazy"
        decoding="async"
        className="absolute -right-28 top-12 h-[24rem] w-[24rem] object-contain opacity-35 animate-float-slow"
      />

      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse-soft" />
      <div className="absolute -right-12 bottom-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse-soft-delayed" />
    </div>
  );
};

export default GlobalPageBackground;
