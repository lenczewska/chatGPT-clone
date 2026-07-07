import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/ru";
import "moment/locale/az";

const SearchModal = ({
  open,
  onOpenChange,
  onSearch,
  value,
  items = [],
  onSelectItem,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-[95vw] sm:max-w-125">
        <Input
          autoFocus
          value={value || ""}
          placeholder={t("search.placeholder")}
          onChange={(e) => onSearch?.(e.target.value)}
        />

        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
          {items.length === 0 ? (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-gray-500">
              {value ? "Ничего не найдено" : "Начните вводить текст для поиска"}
            </div>
          ) : (
            items.map((item) => {
              const title = item.title || item.name || "New chat";
              return (
                <button
                  key={item._id || item.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  onClick={() => {
                    onOpenChange?.(false);
                    onSelectItem?.(item);
                  }}
                >
                  <span className="truncate font-medium">{title}</span>
                  <span className="ml-2 shrink-0 text-xs text-gray-500">
                    {item.messages?.length || 0} msgs
                  </span>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
