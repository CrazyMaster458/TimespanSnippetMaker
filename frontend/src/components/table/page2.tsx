import { columns, Snippet } from "./columns2";
import { DataTable } from "./data-table2";

import jsonData from "../../data/snippets.json";

export default function DataPage() {
  // const data = getData();

  const snippets: Snippet[] = jsonData;

  return (
    <div className="w-full">
      <DataTable columns={columns} data={snippets}></DataTable>
    </div>
  );
}
