// Filter.tsx
import CustomDropdown from "@/components/CustomDropdown/CustomDropdown";
import { Input, InputDateRange } from "@/components";
import { useTranslations } from "next-intl";
import { CategoryOption } from "@/types";

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
        label={t("period")}
        startValue={values.startDate}
        endValue={values.endDate}
        onChangeRange={(r) => onChange({ startDate: r.start, endDate: r.end })}
      />

      <CustomDropdown
        options={categories}
        label={t("category")}
        initialValue={
          // converte string -> Option
          values.categoryId
            ? categories.find((c) => c.value === values.categoryId)
            : undefined
        }
        onSelectOption={(opt) => {
          // Option -> string
          // se quiser permitir "limpar", chame onChange({ categoryId: undefined })
          if (opt) onChange({ categoryId: opt.value });
        }}
      />
    </div>
  );
}
