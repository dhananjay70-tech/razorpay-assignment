import { useState } from 'react'
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react'
import StatusBadge from './StatusBadge'

/**
 * Table — reusable data table with sorting, pagination, and actions.
 */
export default function Table({ 
  columns, 
  data, 
  sortable = false, 
  onSort, 
  onRowClick,
  emptyMessage = 'No data available',
  actions = []
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleSort = (key) => {
    if (!sortable) return
    
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    
    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }

  const sortedData = sortable && sortConfig.key
    ? [...data].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    : data

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider
                  ${sortable ? 'cursor-pointer hover:text-gray-300 transition-colors' : ''}
                `}
                onClick={() => sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {sortable && sortConfig.key === column.key && (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  )}
                </div>
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-4 py-12 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm">
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.key === 'status' ? (
                      <StatusBadge status={row[column.key]} />
                    ) : (
                      <span className="text-gray-300">{row[column.key]}</span>
                    )}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation()
                            action.onClick(row)
                          }}
                          className={`
                            p-1.5 rounded-lg transition-all
                            ${action.danger 
                              ? 'text-red-400 hover:bg-red-500/10' 
                              : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }
                          `}
                          title={action.label}
                        >
                          {action.icon || <MoreHorizontal size={16} />}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
