import Link from "next/link";
import Label from "@/components/ui/label";

export default function CategoryLabel({ categories, nomargin = false }) {
  return (
    <div className="flex gap-3">
      <Link href={'#'}>
        <Label nomargin={nomargin}>
          {categories}
        </Label>
      </Link>
    </div>
  );
}
