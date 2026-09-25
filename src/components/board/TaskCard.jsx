import { forwardRef } from 'react'
import { ChevronLeft, ChevronRight, GripVertical, Trash2 } from 'lucide-react'

const stop = (e) => e.stopPropagation()

// Presentational card; `dragProps` come from dnd-kit's useDraggable (absent in the drag overlay).
const TaskCard = forwardRef(function TaskCard({ task, dragProps, style, dragging, overlay, onMove, onDelete, canPrev, canNext }, ref) {
  return (
    <div
      ref={ref}
      style={style}
      {...dragProps}
      className={`group flex touch-manipulation items-center gap-2 rounded-lg border bg-white p-2 pl-1 dark:bg-slate-950 ${
        overlay ? 'cursor-grabbing border-primary-500 shadow-lg' : 'cursor-grab border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
      } ${dragging ? 'opacity-40' : ''}`}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <p className={`min-w-0 flex-1 break-words text-sm ${task.status === 'done' ? 'text-slate-500 line-through' : ''}`}>{task.title}</p>
      {!overlay && (
        <div className="flex shrink-0 items-center" onKeyDown={stop} onPointerDown={stop} onMouseDown={stop} onTouchStart={stop}>
          <button type="button" className="icon-btn h-9 w-9 disabled:invisible" disabled={!canPrev} onClick={() => onMove(-1)} aria-label={`Move “${task.title}” to the previous column`}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" className="icon-btn h-9 w-9 disabled:invisible" disabled={!canNext} onClick={() => onMove(1)} aria-label={`Move “${task.title}” to the next column`}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" className="icon-btn h-9 w-9 hover:text-rose-600 dark:hover:text-rose-400" onClick={onDelete} aria-label={`Delete “${task.title}”`}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
})

export default TaskCard
