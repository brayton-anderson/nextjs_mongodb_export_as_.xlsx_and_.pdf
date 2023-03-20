"use client";
import { useRef } from "react";
import { Inter } from "next/font/google";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { useReactToPrint } from "react-to-print";

const inter = Inter({ subsets: ["latin"] });

export default function Table2({ children }) {
  const tableRef = useRef(null);
  const conponentPDF = useRef(null);

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: `payments_data_${Date.now}_${Date.UTC}`,
    onAfterPrint: () => alert("Payments Data saved in PDF"),
  });

  return (
    <div  className="w-full">
      <div className="overflow-x-auto">
        <div className="gap-2 py-4 px-2">
          <DownloadTableExcel
            filename={`payments_sheet_${Date.now}_${Date.UTC}`}
            sheet="payments"
            currentTableRef={tableRef.current}
            className="py-2"
          >
            <button className="btn btn-outline btn-accent px-2">
              {" "}
              Export excel{" "}
            </button>
          </DownloadTableExcel>

          <button
            className="btn btn-outline btn-success px-2"
            onClick={generatePDF}
          >
            Generate PDF
          </button>
        </div>
        <div ref={conponentPDF}>
        <h1 className="text-lg font-bold py-2">Yearly Payments</h1>
        <table ref={tableRef} className="table table-compact w-full py-2">
          {children}
        </table>
        </div>
      </div>
    </div>
  );
}
