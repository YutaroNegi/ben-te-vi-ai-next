import CustomDropdown from "@/components/CustomDropdown/CustomDropdown";
import { Input, InputDateRange } from "@/components";
import { useTranslations } from "next-intl";
import { CategoryOption } from "@/types";
import { MdCleaningServices } from "react-icons/md";

type FilterProps = {
  readonly categories: CategoryOption[];
  readonly values: {
    searchTerm: string;
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  };
  readonly onChange: (changes: Partial<FilterProps["values"]>) => void;
};

export default function Filter({ categories, values, onChange }: FilterProps) {
  const t = useTranslations("Filter");

  const isDirty =
    !!values.searchTerm?.trim() ||
    !!values.startDate ||
    !!values.endDate ||
    !!values.categoryId;

  const clearFilters = () => {
    onChange({
      searchTerm: "",
      startDate: "",
      endDate: "",
      categoryId: "",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1rem",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}
      className="w-full"
    >
      <Input
        id="filter-input"
        placeholder={t("searchPlaceholder")}
        label={t("search")}
        value={values.searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({ searchTerm: e.target.value })
        }
      />

      <InputDateRange
        key={`${values.startDate ?? ""}-${values.endDate ?? ""}`}
        label={t("period") ?? "Período"}
        startValue={values.startDate ?? ""}
        endValue={values.endDate ?? ""}
        onChangeRange={(r) =>
          onChange({ startDate: r.start || "", endDate: r.end || "" })
        }
        className="min-w-[26rem]"
      />

      <CustomDropdown
        options={categories}
        label={t("category")}
        initialValue={
          values.categoryId
            ? categories.find((c) => c.value === values.categoryId)
            : undefined
        }
        onSelectOption={(opt) => onChange({ categoryId: opt?.value })}
      />
      <button
        type="button"
        onClick={clearFilters}
        title={t("clear") ?? "Limpar filtros"}
        aria-label={t("clear") ?? "Limpar filtros"}
        className="rounded-full p-2 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!isDirty}
      >
        <MdCleaningServices size={20} />
      </button>
    </div>
  );
}
