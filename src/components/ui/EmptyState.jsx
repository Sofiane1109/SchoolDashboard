export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <h2 className="font-semibold">{title}</h2>
      {message && <p className="mt-1 max-w-sm text-sm muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
