# UI Components Library

A comprehensive React component library built with Tailwind CSS, Framer Motion, and Lucide React icons.

## Installation

All components can be imported from the common index:

```jsx
import { Button, Input, Modal, Table } from './components/common'
```

## Form Components

### Button
Reusable button with variants, sizes, and loading state.

```jsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean

### Input
Form input with label, error, icon, and right element support.

```jsx
<Input 
  label="Email" 
  icon={Mail} 
  error={errorMessage}
  placeholder="Enter your email"
/>
```

**Props:**
- `label`: string
- `error`: string
- `icon`: Lucide icon component
- `rightElement`: React node
- `id`: string

### Select
Dropdown select with label and error support.

```jsx
<Select label="Role" error={error}>
  <option value="EMP">Employee</option>
  <option value="RM">Manager</option>
</Select>
```

### Textarea
Multi-line text input with label and error support.

```jsx
<Textarea 
  label="Description" 
  rows={4}
  placeholder="Enter description"
/>
```

### Checkbox
Checkbox with label support.

```jsx
<Checkbox label="Remember me" checked={true} onChange={handleChange} />
```

### Radio
Radio button with label support.

```jsx
<Radio label="Option 1" name="group" value="1" />
<Radio label="Option 2" name="group" value="2" />
```

### Switch
Toggle switch component.

```jsx
<Switch label="Enable notifications" checked={true} onChange={handleChange} />
```

## Layout Components

### Card
Reusable card with optional hover effect.

```jsx
<Card hover={true}>
  <p>Card content</p>
</Card>
```

### Divider
Visual separator with optional label.

```jsx
<Divider label="Section Title" />
```

## Data Display Components

### Table
Data table with sorting, pagination, and actions.

```jsx
<Table 
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' }
  ]}
  data={tableData}
  sortable={true}
  onSort={(key, direction) => console.log(key, direction)}
  actions={[
    { icon: Edit, onClick: handleEdit, label: 'Edit' },
    { icon: Trash, onClick: handleDelete, label: 'Delete', danger: true }
  ]}
/>
```

### Tabs
Tab navigation with animated indicator.

```jsx
<Tabs 
  tabs={[
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' }
  ]}
  activeTab="tab1"
  onChange={setActiveTab}
/>
```

### Accordion
Collapsible content sections.

```jsx
<Accordion 
  items={[
    { title: 'Section 1', content: 'Content 1' },
    { title: 'Section 2', content: 'Content 2' }
  ]}
  allowMultiple={true}
/>
```

### Badge
Generic badge with variants.

```jsx
<Badge variant="success">Active</Badge>
```

**Variants:** 'default' | 'primary' | 'success' | 'warning' | 'danger'

### DashboardCard
Animated stat card for dashboards.

```jsx
<DashboardCard 
  title="Total Users" 
  value="1,234" 
  subtitle="+12% from last month"
  icon={Users}
  color="indigo"
/>
```

### StatusBadge
Status badge for reimbursement statuses.

```jsx
<StatusBadge status="APPROVED" />
```

**Statuses:** 'PENDING' | 'APPROVED' | 'REJECTED'

### Avatar
User avatar with fallback initials.

```jsx
<Avatar name="John Doe" size="md" />
<Avatar src="/avatar.jpg" alt="User" size="lg" />
```

## Feedback Components

### Modal
Accessible dialog overlay.

```jsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose} 
  title="Modal Title"
  size="lg"
>
  <p>Modal content</p>
</Modal>
```

**Sizes:** 'sm' | 'md' | 'lg' | 'xl'

### Alert
Dismissible alert messages.

```jsx
<Alert variant="success" title="Success">
  Your changes have been saved.
</Alert>
```

**Variants:** 'info' | 'success' | 'warning' | 'error'

### Progress
Progress bar with variants.

```jsx
<Progress value={75} max={100} color="indigo" size="md" />
```

### Skeleton
Loading placeholder with shimmer effect.

```jsx
<Skeleton variant="card" />
<Skeleton variant="text" />
```

**Variants:** 'default' | 'circle' | 'text' | 'avatar' | 'card'

### Tooltip
Tooltip with positioning support.

```jsx
<Tooltip content="Hover tooltip" position="top">
  <Button>Hover me</Button>
</Tooltip>
```

**Positions:** 'top' | 'bottom' | 'left' | 'right'

### Dropdown
Dropdown menu with trigger and items.

```jsx
<Dropdown 
  trigger={<Button>Menu</Button>}
  items={[
    { label: 'Edit', icon: Edit, onClick: handleEdit },
    { label: 'Delete', icon: Trash, onClick: handleDelete, danger: true }
  ]}
  align="right"
/>
```

### Loader
Loading spinner component.

```jsx
<Loader size="md" />
```

### EmptyState
Empty state placeholder.

```jsx
<EmptyState 
  title="No data found" 
  description="Try adjusting your filters"
/>
```

## Utility Components

### SearchBox
Search input with icon.

```jsx
<SearchBox placeholder="Search..." onSearch={handleSearch} />
```

### Pagination
Pagination component.

```jsx
<Pagination 
  currentPage={1} 
  totalPages={10} 
  onPageChange={handlePageChange}
/>
```

## Theme System

### ThemeProvider
Wrap your app with ThemeProvider for theme support.

```jsx
import { ThemeProvider } from './theme/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}
```

### useTheme Hook
Access theme state in components.

```jsx
import { useTheme } from './hooks/useTheme'

function Component() {
  const { isDark, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>Toggle Theme</button>
}
```

### Design Tokens
Access design system values.

```jsx
import { colors, spacing, borderRadius } from './theme'

console.log(colors.primary[500]) // '#6366f1'
console.log(spacing.md) // '1rem'
```

## Styling

All components use Tailwind CSS with custom design tokens. The theme supports:
- Dark/light mode
- Custom color palette
- Consistent spacing and sizing
- Smooth animations with Framer Motion

## Best Practices

1. **Import from index:** Use the common index for cleaner imports
2. **Use forwardRef:** Form components support ref forwarding
3. **Accessibility:** Components include proper ARIA labels
4. **Responsive:** Components work across all screen sizes
5. **Animations:** Subtle animations enhance UX without being distracting
