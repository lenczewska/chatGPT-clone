import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const SearchModal = ({ open, onOpenChange, onSearch }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-[95vw] sm:max-w-125">
        <Input
          autoFocus
          placeholder="Поиск в чатах..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default SearchModal