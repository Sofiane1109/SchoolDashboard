import { useState } from 'react'
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import { STATUSES } from '../../lib/constants'

function DraggableTask({ task, index, onMove, onDelete }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id: task.id, data: { task } })
  return (
    <TaskCard
      ref={setNodeRef}
      task={task}
      dragProps={{ ...attributes, ...listeners, 'aria-roledescription': 'draggable task' }}
      dragging={isDragging}
      onMove={(dir) => onMove(task, STATUSES[index + dir].value)}
      onDelete={() => onDelete(task)}
      canPrev={index > 0}
      canNext={index < STATUSES.length - 1}
    />
  )
}

function Column({ status, index, tasks, onMove, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.value })
  const Icon = status.icon
  return (
    <section
      ref={setNodeRef}
      aria-label={`${status.label} (${tasks.length})`}
      className={`flex min-h-[160px] flex-col rounded-xl border p-3 transition-colors duration-200 ${
        isOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <header className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} aria-hidden="true" />
        <Icon className="h-4 w-4 muted" aria-hidden="true" />
        <h2 className="font-sans text-sm font-semibold">{status.label}</h2>
        <span className="ml-auto rounded-md bg-white px-2 py-0.5 font-display tabular-nums text-xs font-semibold dark:bg-slate-800">{tasks.length}</span>
      </header>
      <div className="flex flex-1 flex-col gap-2">
        {tasks.map((t) => (
          <DraggableTask key={t.id} task={t} index={index} onMove={onMove} onDelete={onDelete} />
        ))}
        {tasks.length === 0 && (
          <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm muted dark:border-slate-700">
            Drop a task here
          </p>
        )}
      </div>
    </section>
  )
}

export default function Board({ tasks, onMove, onDelete }) {
  const [active, setActive] = useState(null)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = ({ active: dragged, over }) => {
    setActive(null)
    const task = dragged.data.current?.task
    if (task && over && over.id !== task.status) onMove(task, over.id)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active: a }) => setActive(a.data.current?.task ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActive(null)}
      accessibility={{
        screenReaderInstructions: {
          draggable: 'Press Space to pick up the task, use the arrow keys to move it, Space to drop it, Escape to cancel.',
        },
      }}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {STATUSES.map((status, i) => (
          <Column key={status.value} status={status} index={i} tasks={tasks.filter((t) => t.status === status.value)} onMove={onMove} onDelete={onDelete} />
        ))}
      </div>
      <DragOverlay>{active && <TaskCard task={active} overlay />}</DragOverlay>
    </DndContext>
  )
}
