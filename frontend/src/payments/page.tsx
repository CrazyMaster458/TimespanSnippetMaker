import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

import jsonData from "./../data/payments.json";

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ];
// }

export default function DemoPage() {
  // const data = getData();

  const payments: Payment[] = jsonData;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={payments}></DataTable>
    </div>
  );
}
