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
      <DialogContent className="sm:max-w-[500px]  ">
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