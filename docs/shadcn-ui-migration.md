# Shadcn UI Migration Guide

This document outlines the steps taken to migrate the Prompt Engine application to use shadcn UI components.

## Completed Steps

1. **Installed core dependencies**:
   ```bash
   pnpm add tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
   ```

2. **Initialized shadcn UI**:
   ```bash
   pnpm dlx shadcn@latest init
   ```
   - Selected the "New York" style
   - Selected "Neutral" as the base color

3. **Created required directories and utility files**:
   - `/components/ui` - For shadcn UI components
   - `/lib/utils.ts` - For utility functions like `cn()` for class merging
   - `/hooks` - For hook utilities like use-toast

4. **Added shadcn UI components**:
   ```bash
   # Core components
   pnpm dlx shadcn@latest add button card select input textarea form popover dropdown-menu
   
   # Additional components for notifications and feedback
   pnpm dlx shadcn@latest add alert dialog toast
   
   # Navigation and UI components
   pnpm dlx shadcn@latest add tooltip tabs
   
   # UI elements
   pnpm dlx shadcn@latest add avatar skeleton sheet
   ```

5. **Updated application components**:
   - `PromptBuilder.tsx` - Updated header, buttons, and card structure
   - `DynamicFields.tsx` - Replaced custom inputs with shadcn UI form components
   - `TemplateSelect.tsx` - Updated to use Card and Input components
   - `PromptPreview.tsx` - Migrated to use Card, CardHeader, and CardContent
   - `PromptLogs.tsx` - Updated to use Card and Button components
   - `EnvironmentStatus.tsx` - Updated to use Card, Button, and other shadcn UI components
   - `TestComponent.tsx` - Simple test component using Card
   
6. **Updated application layout**:
   - Added Toaster component to root layout for toast notifications

## All Components Now Using shadcn UI

All components in the application have been migrated to use shadcn UI components, providing:

- Consistent design language
- Improved accessibility
- Better component states (hover, focus, disabled)
- TypeScript integration
- Theme support via CSS variables

## Available shadcn UI Components

The following shadcn UI components are now available in the application:

### Layout Components
- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Sheet`

### Form Components
- `Button`
- `Input`
- `Textarea`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Form`
- `Label`

### Interactive Components
- `Dialog`, `DialogTrigger`, `DialogContent`
- `Popover`, `PopoverTrigger`, `PopoverContent`
- `Dropdown`, `DropdownMenu`, `DropdownMenuItem`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Tooltip`, `TooltipTrigger`, `TooltipContent`

### Feedback & Notifications
- `Alert`, `AlertTitle`, `AlertDescription`
- `Toast` (via Toaster component and useToast hook)

### UI Elements
- `Avatar`, `AvatarImage`, `AvatarFallback`
- `Skeleton`

## Usage Examples

### Buttons

```tsx
<Button variant="default">Primary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
<Button variant="destructive">Destructive Button</Button>
```

### Cards

```tsx
<Card>
  <CardHeader>
    <h3 className="text-lg font-semibold">Card Title</h3>
    <p className="text-muted-foreground">Card description</p>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Form Controls

```tsx
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter your name" />
</div>

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Toast Notifications

```tsx
import { useToast } from '@/hooks/use-toast';

export function MyComponent() {
  const { toast } = useToast();
  
  const showToast = () => {
    toast({
      title: "Success",
      description: "Operation completed successfully",
    });
  };
  
  return <Button onClick={showToast}>Show Toast</Button>;
}
```

## Class Naming Conventions

When using shadcn UI:

1. Use the `cn()` utility from `@/lib/utils` to combine classes:
   ```tsx
   import { cn } from "@/lib/utils";
   
   <div className={cn(
     "base-classes-here",
     condition && "conditional-classes-here"
   )}>
   ```

2. Use shadcn UI's predefined color variables in tailwind classes:
   - `bg-primary` instead of hard-coded colors
   - `text-primary-foreground` for text on primary backgrounds
   - `border-border` for standard borders
   - `bg-muted` for subtle background areas

## Related Documentation

- [shadcn UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Class Variance Authority](https://cva.style/docs) 