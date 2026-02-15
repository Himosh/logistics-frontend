import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder, getProductsByName } from "@/lib/api";
import type { Product } from "@/types";

interface LineItem {
  product_id: string;
  product_name: string;
  quantity: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateOrderModal({ open, onOpenChange, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LineItem[]>([{ product_id: "", product_name: "", quantity: "" }]);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<{ [key: number]: Product[] }>({});
  const [searchLoading, setSearchLoading] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({ 0: "" });
  const [popoverOpen, setPopoverOpen] = useState<{ [key: number]: boolean }>({});

  // Debounce search - auto search when 3+ characters
  useEffect(() => {
    const delays: { [key: number]: NodeJS.Timeout } = {};

    Object.entries(searchQuery).forEach(([indexStr, query]) => {
      const index = Number(indexStr);
      const item = items[index];
      
      // Don't show dropdown if product is already selected and query matches product name
      if (item?.product_id && item?.product_name === query) {
        setPopoverOpen((prev) => ({ ...prev, [index]: false }));
        return;
      }
      
      if (query.length >= 2) {
        // Show dropdown when 2+ chars
        setPopoverOpen((prev) => ({ ...prev, [index]: true }));
        
        if (query.length >= 3) {
          // Auto search when 3+ chars
          delays[index] = setTimeout(async () => {
            setSearchLoading((prev) => ({ ...prev, [index]: true }));
            try {
              const products = await getProductsByName(query);
              setSearchResults((prev) => ({ ...prev, [index]: products }));
            } catch {
              // Error handled by API layer
            } finally {
              setSearchLoading((prev) => ({ ...prev, [index]: false }));
            }
          }, 300);
        } else {
          // Load all products for 2 chars
          setSearchLoading((prev) => ({ ...prev, [index]: true }));
          getProductsByName().then((products) => {
            setSearchResults((prev) => ({ ...prev, [index]: products }));
            setSearchLoading((prev) => ({ ...prev, [index]: false }));
          }).catch(() => {
            setSearchLoading((prev) => ({ ...prev, [index]: false }));
          });
        }
      } else {
        // Hide dropdown when less than 2 chars
        setPopoverOpen((prev) => ({ ...prev, [index]: false }));
        setSearchResults((prev) => ({ ...prev, [index]: [] }));
      }
    });

    return () => {
      Object.values(delays).forEach(clearTimeout);
    };
  }, [searchQuery, items]);

  const addItem = () => {
    const newIndex = items.length;
    setItems([...items, { product_id: "", product_name: "", quantity: "" }]);
    setSearchQuery((prev) => ({ ...prev, [newIndex]: "" }));
  };

  const removeItem = (i: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== i));
    const newSearchQuery = { ...searchQuery };
    delete newSearchQuery[i];
    setSearchQuery(newSearchQuery);
    const newSearchResults = { ...searchResults };
    delete newSearchResults[i];
    setSearchResults(newSearchResults);
    const newPopoverOpen = { ...popoverOpen };
    delete newPopoverOpen[i];
    setPopoverOpen(newPopoverOpen);
  };

  const updateItem = (i: number, field: keyof LineItem, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const selectProduct = (i: number, product: Product) => {
    const updated = [...items];
    updated[i] = { ...updated[i], product_id: String(product.id), product_name: product.name };
    setItems(updated);
    setSearchQuery((prev) => ({ ...prev, [i]: product.name }));
    setPopoverOpen((prev) => ({ ...prev, [i]: false }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    items.forEach((item, i) => {
      if (!item.product_id || isNaN(Number(item.product_id))) {
        errs.push(`Item ${i + 1}: valid product required`);
      }
      if (!item.quantity || Number(item.quantity) < 1) {
        errs.push(`Item ${i + 1}: quantity must be > 0`);
      }
    });
    setErrors(errs);
    return errs.length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createOrder({
        items: items.map((i) => ({
          product_id: Number(i.product_id),
          quantity: Number(i.quantity),
        })),
      });
      setItems([{ product_id: "", product_name: "", quantity: "" }]);
      setErrors([]);
      setSearchQuery({ 0: "" });
      setSearchResults({});
      setPopoverOpen({});
      onOpenChange(false);
      onSuccess();
    } catch {
      // toast shown by api layer
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Product</Label>
                  <div className="relative">
                    <Input
                      placeholder="Search product (min 2 chars)..."
                      value={searchQuery[i] || ""}
                      onChange={(e) => {
                        const query = e.target.value;
                        setSearchQuery((prev) => ({ ...prev, [i]: query }));
                        if (!query) {
                          updateItem(i, "product_id", "");
                          updateItem(i, "product_name", "");
                        }
                      }}
                      className={item.product_id ? "border-green-500" : ""}
                    />
                    {item.product_id && (
                      <Check className="absolute right-2 top-2.5 h-4 w-4 text-green-500" />
                    )}
                    {popoverOpen[i] && (
                      <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
                        {searchLoading[i] ? (
                          <div className="p-4 text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Searching...
                          </div>
                        ) : searchResults[i] && searchResults[i].length > 0 ? (
                          <div className="max-h-[300px] overflow-y-auto">
                            {searchResults[i].map((product) => (
                              <div
                                key={product.id}
                                onClick={() => selectProduct(i, product)}
                                className="px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{product.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ID: {product.id}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-sm text-center text-muted-foreground">
                            {searchQuery[i] && searchQuery[i].length >= 3
                              ? "No products found"
                              : "No products available"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-24 space-y-1">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(i, "quantity", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  className="mb-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-3 w-3 mr-1" /> Add Item
          </Button>

          {errors.length > 0 && (
            <div className="text-xs text-destructive space-y-0.5">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
