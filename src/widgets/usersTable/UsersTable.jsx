// Сортировку выполнять проще на клиентской стороне, так как объем данных небольшой
// и уменьшается вероятность ошибки 429(перегрузка), для такой задачи проще сделать один запрос
// на всю data и сортировать клиентом, чем рефрешить и стучаться к внешнему серверу
// каждый раз при клике на табличный хедер, к тому же tanstack table предоставляет удобную сортировку

// решил не переизобретать велосипед, а воспользоваться
// tanstack table(бывшая react-table) - легковесной библиотечкой для работы с таблицами

import { useState, useEffect, useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getUsers } from "@/entitites/user/model/getUsers";
import styles from "./UsersTable.module.css";
import PopUp from "@/shared/PopUp/PopUp";

const UsersTable = () => {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const dialogRef = useRef(null);

  const openModal = (user) => {
    setSelectedUser(user);
    dialogRef.current?.showModal(); // Показывает диалог поверх всего
  };

  const closeModal = () => {
    dialogRef.current?.close();
    setSelectedUser(null);
  };
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  // Проверка правильной подгрузки ресурсов

  useEffect(() => {
    getUsers()
      .then((result) => {
        setTableData(result);
      })
      .catch((err) => {
        console.error(err);
        //setIsLoading(false);
      });
  }, []);

  // useMemo чтобы не перегружать каждый раз хедеры таблицы
  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        sortingFn: "text",
        size: 200,
        minSize: 50,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        sortingFn: "text",
        size: 200,
        minSize: 50,
      },
      {
        accessorKey: "age",
        header: "Age",
        size: 200,
        minSize: 50,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 200,
        minSize: 50,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 200,
        minSize: 50,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 350,
        enableSorting: false,
        enableColumnFilter: false,
        minSize: 50,
      },
      {
        accessorKey: "country",
        header: "Country",
        enableSorting: false,
        enableColumnFilter: false,
        size: 200,
        minSize: 50,
      },
      {
        accessorKey: "city",
        header: "City",
        enableSorting: false,
        enableColumnFilter: false,
        size: 200,
        minSize: 50,
      },
    ],
    [],
  );
  // if (isLoading) return <p>Loading...</p>;
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, // hook to change data pages when pagination state changes
    state: {
      pagination,
    },
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
  });
  return (
    <div className={styles.container_shared}>
      <div className={styles.container_table}>
        <table
          className={styles.fetched_table}
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={styles.table_header}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: "▲",
                            desc: "▼",
                          }[header.column.getIsSorted()] ?? null}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </div>
                      )}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={styles.resizer}
                        style={{
                          cursor: "col-resize",
                          userSelect: "none",
                          touchAction: "none",
                        }}
                      />
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={styles.table_row}
                onClick={() => openModal(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.table_cell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination_controls}>
        <div className={styles.buttons_wrapper}>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={styles.pagination_controls_btn}
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={styles.pagination_controls_btn}
          >
            Next
          </button>
        </div>
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
      <PopUp ref={dialogRef} user={selectedUser} onClose={closeModal} />
    </div>
  );
};

function Filter({ column, table }) {
  // const firstValue = table
  //   .getPreFilteredRowModel()
  //   .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return (
    <input
      className="filter-search"
      onChange={(e) => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={columnFilterValue ?? ""}
    />
  );
}

export default UsersTable;
