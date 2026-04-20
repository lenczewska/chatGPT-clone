import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const SearchModal = ({ open, onOpenChange, onSearch }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
       

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
