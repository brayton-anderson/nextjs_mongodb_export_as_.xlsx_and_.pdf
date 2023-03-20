import { Inter } from "next/font/google";
import { getPayments } from "@/app/lib/mongos/payments";
import {
  getGroupedWeeklyPayments,
  getGroupedMonthlyPayments,
  getGroupedYearlyPayments,
  getGroupedDailyPayments,
} from "@/app/lib/mongos/payments";
import Table from "./components/table";
import Table2 from "./components/table2";
import Table3 from "./components/table3";
import XLSX from "xlsx";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

async function fetchPayments() {
  const { payments } = await getPayments();
  if (!payments) throw new Error("Failed to fetch payments!");

  return payments;
}

async function fetchGroupedWeeklyPayments() {
  const { grpaymentsweek } = await getGroupedWeeklyPayments();
  if (!grpaymentsweek) throw new Error("Failed to fetch payments!");

  console.log(grpaymentsweek);
  return grpaymentsweek;
}

async function fetchGroupedMonthlyPayments() {
  const { grpaymentsmonth } = await getGroupedMonthlyPayments();
  if (!grpaymentsmonth) throw new Error("Failed to fetch payments!");

  console.log(grpaymentsmonth);
  return grpaymentsmonth;
}

async function fetchGroupedDailyPayments() {
  const { grpaymentsdaily } = await getGroupedDailyPayments();
  if (!grpaymentsdaily) throw new Error("Failed to fetch payments!");

  console.log(grpaymentsdaily);
  return grpaymentsdaily;
}

async function fetchGroupedYearlyPaymentss() {
  const { grpaymentsyear } = await getGroupedYearlyPayments();
  if (!grpaymentsyear) throw new Error("Failed to fetch payments!");

  console.log(grpaymentsyear);
  return grpaymentsyear;
}

function formatYear(newDate) {
  const d = newDate;
  const year = d.getFullYear(); // Thu
  const formatted = `${year}`;
  return formatted.toString();
}

function formatMonths(newDate) {
  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  const d = newDate;
  const month = months[d.getMonth()]; // Thu
  const formatted = `${month}`;
  return formatted.toString();
}

function formatMonthsVerify(newDate) {
  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  const d = newDate;
  const month = months[newDate]; // Thu
  const formatted = `${month}`;
  return formatted.toString();
}

function formatMonth(newDate) {
  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = newDate;
  const year = d.getFullYear();
  const date = d.getDate();
  const monthIndex = d.getMonth();
  const monthName = months[d.getMonth()];
  const dayName = days[d.getDay()]; // Thu
  const formatted = `${monthName} ${year}`;
  return formatted.toString();
}

function formatDate(newDate) {
  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = newDate;
  const year = d.getFullYear();
  const date = d.getDate();
  const monthIndex = d.getMonth();
  const monthName = months[d.getMonth()];
  const dayName = days[d.getDay()]; // Thu
  const formatted = `${dayName}, ${date} ${monthName} ${year}`;
  return formatted.toString();
}

export async function Columns() {
  const payments = await fetchPayments();
  const currency = "Ksh";

  return (
    <tbody>
      {payments.map((payment, index) => (
        <tr key={payment._id}>
          <th>{index + 1}</th>
          <td>{payment.paymentReferenceCode}</td>
          <td>{payment.paymentType}</td>
          <td>{payment.paymentDescription}</td>
          <td>{currency + " " + payment.procedureAmount}</td>
          <td>{payment.paymentDiscount}</td>
          <td>{currency + " " + payment.AmountPaid}</td>
          <td>{payment.discountRefNo}</td>
          <td>{payment.discountGivenBy}</td>
          <td>{payment.username}</td>
          <td>{payment.createdAt}</td>
        </tr>
      ))}
    </tbody>
  );
}

export async function Columns3() {
  const dailypayments = await fetchGroupedDailyPayments();
  const currency = "Ksh";

  return (
    <tbody>
      {dailypayments.map((dpayment, index) => (
        <tr key={dpayment._id}>
          <th>{index + 1}</th>
          <td>{formatDate(new Date(dpayment._id.date))}</td>
          <td>{currency + " " + dpayment.total_cost_day}</td>
          <td>{dpayment.type}</td>
        </tr>
      ))}
    </tbody>
  );
}

const downloadDailyExcel = async () => {
  const dailypayments = await fetchGroupedDailyPayments();
  const currency = "Ksh";
  const newData = dailypayments.map((dpayment, index) => {
    const data = [
      {
        id: index + 1,
        date: formatDate(new Date(dpayment._id.date)),
        total: currency + " " + dpayment.total_cost_day,
        type: dpayment.type,
      },
    ];

    return data;
  });
  const workSheet = XLSX.utils.json_to_sheet(newData);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "daily_payments");
  //Buffer
  let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
  //Binary string
  XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
  //Download
  XLSX.writeFile(workBook, "Daily_Payments_Data.xlsx");
};

const downloadYearlyExcel = async () => {
  const groupedYearlyPayments = await fetchGroupedYearlyPaymentss();
  const groupedMonthlyPayments = await fetchGroupedMonthlyPayments();
  const groupedWeeklyPayments = await fetchGroupedWeeklyPayments();
  const currency = "Ksh";
  const newData = groupedYearlyPayments.map((grpayment) => {
    if (grpayment._id.year == formatYear(new Date(grpayment.dayfirst))) {
      groupedMonthlyPayments.map((grpaymentmonth) => {
        if (
          grpayment._id.year == formatYear(new Date(grpaymentmonth.dayfirst))
        ) {
          groupedWeeklyPayments.map((grpaymentweek, index) => {
            if (
              formatYear(new Date(grpaymentweek.dayfirst)) ==
                grpayment._id.year &&
              formatMonths() ==
                formatMonthsVerify(`${grpaymentmonth._id.month - 1}`)
            ) {
              const data = [
                {
                  id: index + 1,
                  year: grpayment._id.year,
                  month_no: grpaymentmonth._id.month,
                  week: grpaymentweek._id.week,
                  month: formatMonthsVerify(`${grpaymentmonth._id.month - 1}`),
                  payment_type: grpaymentweek.type,
                  totalperweek: currency + " " + grpaymentweek.total_cost_week,
                  totalpermonth:
                    currency + " " + grpaymentmonth.total_cost_month,
                  totalperyear: currency + " " + grpayment.total_cost_year,
                },
              ];

              console.log(data);

              return data;
            }
          });
        }
      });
    }
  });
  const workSheet = XLSX.utils.json_to_sheet(newData);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "yearly_payments");
  //Buffer
  let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
  //Binary string
  XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
  //Download
  XLSX.writeFile(workBook, "Yearly_Payments_Data.xlsx");
};

export async function Button1() {
  return (
    <button
      className="btn btn-outline btn-accent px-2"
      onClick={await downloadYearlyExcel()}
    >
      {" "}
      Export excel{" "}
    </button>
  );
}

export async function Button2() {
  return (
    <button
      className="btn btn-outline btn-accent px-2"
      onClick={await downloadDailyExcel()}
    >
      {" "}
      Export excel{" "}
    </button>
  );
}

export async function Columns2() {
  const groupedYearlyPayments = await fetchGroupedYearlyPaymentss();
  const groupedMonthlyPayments = await fetchGroupedMonthlyPayments();
  const groupedWeeklyPayments = await fetchGroupedWeeklyPayments();

  const currency = "Ksh";
  return (
    <div>
      <table className="table table-compact w-full">
        {groupedYearlyPayments.map((grpayment, index) => {
          if (grpayment._id.year == formatYear(new Date(grpayment.dayfirst))) {
            return (
              <>
                <div className="py-2">
                  <thead>
                    <tr>
                      <th className="bg-black"></th>
                      <th
                        key={grpayment}
                        className="w-full content-center text-center bg-black text-white uppercase"
                      >
                        Year {grpayment._id.year}
                      </th>
                    </tr>
                  </thead>
                </div>
                <div>
                  {groupedMonthlyPayments.map((grpaymentmonth, index) => {
                    if (
                      grpayment._id.year ==
                      formatYear(new Date(grpaymentmonth.dayfirst))
                    ) {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th></th>
                              <th
                                key={grpaymentmonth}
                                className="w-full content-center text-center"
                              >
                                {formatMonthsVerify(
                                  `${grpaymentmonth._id.month - 1}`
                                )}
                              </th>
                            </tr>
                          </thead>
                          <div className="w-fit content-center text-center">
                            <thead>
                              <tr>
                                <th></th>
                                {groupedWeeklyPayments.map(
                                  (grpaymentweek, index) => {
                                    if (
                                      formatYear(
                                        new Date(grpaymentweek.dayfirst)
                                      ) == grpayment._id.year &&
                                      formatMonths(
                                        new Date(grpaymentweek.dayfirst)
                                      ) ==
                                        formatMonthsVerify(
                                          `${grpaymentmonth._id.month - 1}`
                                        )
                                    ) {
                                      return (
                                        <>
                                          <th key={grpaymentweek}>
                                            Week {grpaymentweek._id.week}
                                          </th>
                                        </>
                                      );
                                    } else {
                                      return null;
                                    }
                                  }
                                )}
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <th>Turnover</th>
                                {groupedWeeklyPayments.map(
                                  (grpaymentcostweek, index) => {
                                    if (
                                      formatYear(
                                        new Date(grpaymentcostweek.dayfirst)
                                      ) == grpayment._id.year &&
                                      formatMonths(
                                        new Date(grpaymentcostweek.dayfirst)
                                      ) ==
                                        formatMonthsVerify(
                                          `${grpaymentmonth._id.month - 1}`
                                        )
                                    ) {
                                      return (
                                        <>
                                          <td key={grpaymentcostweek}>
                                            {currency +
                                              " " +
                                              grpaymentcostweek.total_cost_week}
                                          </td>
                                          {/* <td>{formatDate(new Date(weeks[weekNum].dateCreated))} - {formatDate(new Date(weeks[weekNum].weekEnd))}</td> */}
                                        </>
                                      );
                                    } else {
                                      return null;
                                    }
                                  }
                                )}
                                </tr>
                                <tr>
                                <th>Payment Type</th>
                                {groupedWeeklyPayments.map(
                                  (grpaymentcostweek, index) => {
                                    if (
                                      formatYear(
                                        new Date(grpaymentcostweek.dayfirst)
                                      ) == grpayment._id.year &&
                                      formatMonths(
                                        new Date(grpaymentcostweek.dayfirst)
                                      ) ==
                                        formatMonthsVerify(
                                          `${grpaymentmonth._id.month - 1}`
                                        )
                                    ) {
                                      return (
                                        <>
                                          <td key={grpaymentcostweek}>
                                            {grpaymentcostweek.type}
                                          </td>
                                          {/* <td>{formatDate(new Date(weeks[weekNum].dateCreated))} - {formatDate(new Date(weeks[weekNum].weekEnd))}</td> */}
                                        </>
                                      );
                                    } else {
                                      return null;
                                    }
                                  }
                                )}
                              </tr>
                              <tr className="w-full">
                                <th className="capitalize">
                                  Month Total Turnover
                                </th>
                                <td
                                  key={grpaymentmonth}
                                  className="font-bold bg-black text-white"
                                >
                                  {"  " +
                                    currency +
                                    " " +
                                    grpaymentmonth.total_cost_month +
                                    "  "}
                                </td>
                              </tr>
                              <tr>
                                <th className="background-none bg-opacity-0"></th>
                              </tr>
                            </tbody>
                          </div>
                        </>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
                <div>
                  <thead>
                    <tr>
                      <th className="w-full bg-black text-white uppercase">
                        Year {grpayment._id.year} Turnover
                      </th>
                      <th
                        key={grpayment}
                        className="w-full content-center text-center bg-black text-white uppercase"
                      >
                        {currency + " " + grpayment.total_cost_year}
                      </th>
                    </tr>
                  </thead>
                </div>
              </>
            );
          } else {
            return null;
          }
        })}
      </table>
    </div>
  );
}

export default async function Home() {
  return (
    <div className={styles.main}>
      <Table3>
        {/* <Button2 /> */}
        <Columns3 />
      </Table3>

      <Table2>
        {/* <Button1 /> */}
        <Columns2 />
      </Table2>

      <Table>
        <Columns />
      </Table>
    </div>
  );
}
