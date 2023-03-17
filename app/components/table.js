"use client"
import { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import Columns from './columns';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { useReactToPrint } from "react-to-print";

const inter = Inter({ subsets: ['latin'] })

export default async function Table() {
  const tableRef = useRef(null);
  const conponentPDF = useRef(null);

  const generatePDF= useReactToPrint({
    content: ()=>conponentPDF.current,
    documentTitle:`payments_data_${Date.now}_${Date.UTC}`,
    onAfterPrint:()=>alert("Payments Data saved in PDF")
});


  return (
      <div ref={conponentPDF} className="w-full">
      <div className="overflow-x-auto">
        <DownloadTableExcel
          filename={`payments_sheet_${Date.now}_${Date.UTC}`}
          sheet="payments"
          currentTableRef={tableRef.current}
        >

          <button className="btn btn-outline btn-accent"> Export excel </button>

        </DownloadTableExcel>

        <button className="btn btn-outline btn-success" onClick={ generatePDF}>Generate PDF</button> 

        <table  ref={tableRef} className="table table-compact w-full">
        <thead>
      <tr>
        <th></th> 
        <th>Name</th> 
        <th>Job</th> 
        <th>company</th> 
        <th>location</th> 
        <th>Last Login</th> 
        <th>Favorite Color</th>
      </tr>
    </thead> 
    <Columns/>
        </table>
        </div>
        </div>
  )
}