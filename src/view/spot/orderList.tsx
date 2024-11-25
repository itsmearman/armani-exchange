import React from "react";

function OrderList({ orders }:any) {
  return (
    <div className="bg-white shadow w-full md:w-[35%] rounded-lg p-6 mx-auto pb-24">
      <h2 className="text-lg font-bold text-gray-800 mb-4">لیست سفارشات</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-gray-700">قیمت</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700">مقدار</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-700">نوع</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="border border-gray-300 px-4 py-4 text-center text-gray-600"
                >
                  سفارشی وجود ندارد
                </td>
              </tr>
            ) : (
              orders.map((order : any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {order.price}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {order.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {order.type === "buy" ? "خرید" : "فروش"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;
