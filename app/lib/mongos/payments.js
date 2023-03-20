import clientPromise from "."

let client
let db
let payments
let grpaymentsyear
let grpaymentsmonth
let grpaymentsweek
let grpaymentsdaily


async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = await client.db()
        payments = await db.collection('payments')
        grpaymentsyear = await db.collection('payments').aggregate([
            { 
                $group: {
                    _id:  { 
                        year: { $year: "$createdAt" }
                    },
                    total_cost_year: { $sum:  "$AmountPaid" }, dayfirst: { $first: "$createdAt"}, daylast: { $last: "$createdAt"}
                }
            }
            ])
            grpaymentsmonth = await db.collection('payments').aggregate([
                { 
                    $group: {
                        _id:  {  
                            month: { $month: "$createdAt" }
                        },
                        total_cost_month: { $sum: "$AmountPaid" },
                        dayfirst: { $first: "$createdAt"},
                        daylast: { $last: "$createdAt"}
                    }
                }
                ])
                grpaymentsweek = await db.collection('payments').aggregate([
                    { 
                        $group: {
                            _id:  {
                                 week: { $week: "$createdAt"}},
                                 total_cost_week: { $sum: "$AmountPaid" }, 
                                 type: { $first: "$paymentType"},
                                 dayfirst: { $first: "$createdAt"}, 
                                 daylast: { $last: "$createdAt"}
                        }
                    }
                    ])
                    grpaymentsdaily = await db.collection('payments').aggregate([
                        { 
                            $group: {
                                _id:  {
                                    date:{$dateToString:{format: "%Y-%m-%d", date: "$createdAt"}},
                                     day: { $dayOfMonth: "$createdAt"}},
                                     total_cost_day: { $sum: "$AmountPaid" }, 
                                     type: { $first: "$paymentType"},
                            }
                        }
                        ])
    } catch (error) {
        throw new Error(error)
    }
}

;(async () => {
    await init()
})()



//////////////////
//// PAYMENTS ////
//////////////////

export async function getPayments() {
    try {
        if (!payments) await init()
        const results = await payments
        .find({})
        // .limit(50)
        .toArray()

        return { payments: results }
    } catch (error) {
        throw new Error(error)
        return { error: 'Failed to fetch payments' }
    }
}


export async function getGroupedWeeklyPayments() {
    try {
        if (!grpaymentsweek) await init()
        const results = await grpaymentsweek
        // .limit(50)
        .toArray()
        //console.log(results)
        return { grpaymentsweek: results }
    } catch (error) {
        throw new Error(error)
        return { error: 'Failed to fetch grouped weekly payments' }
    }
}

export async function getGroupedMonthlyPayments() {
    try {
        if (!grpaymentsmonth) await init()
        const results = await grpaymentsmonth
        // .limit(50)
        .toArray()
        //console.log(results)
        return { grpaymentsmonth: results }
    } catch (error) {
        throw new Error(error)
        return { error: 'Failed to fetch grouped monthly payments' }
    }
}

export async function getGroupedYearlyPayments() {
    try {
        if (!grpaymentsyear) await init()
        const results = await grpaymentsyear
        // .limit(50)
        .toArray()
        //console.log(results)
        return { grpaymentsyear: results }
    } catch (error) {
        throw new Error(error)
        return { error: 'Failed to fetch grouped yearly payments' }
    }
}

export async function getGroupedDailyPayments() {
    try {
        if (!grpaymentsdaily) await init()
        const results = await grpaymentsdaily
        // .limit(50)
        .toArray()
        //console.log(results)
        return { grpaymentsdaily: results }
    } catch (error) {
        throw new Error(error)
        return { error: 'Failed to fetch grouped yearly payments' }
    }
}

