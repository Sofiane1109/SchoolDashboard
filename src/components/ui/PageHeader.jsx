export default function PageHeader({ title, subtitle, action }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
