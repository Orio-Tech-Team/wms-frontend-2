import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import InputTypeDropDown from "../InputTypeDropDown/InputTypeDropDown";
import styles from "./styles.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import axiosFunction from "../../../functions/axios";
import { Search } from "@mui/icons-material";
import InputTypeText from "../InputTypeText/InputTypeText";
//
const headCells = [
  {
    id: "product_no",
    numeric: true,
    disablePadding: true,
    label: "Product #",
  },
  {
    id: "product_name",
    numeric: false,
    disablePadding: false,
    label: "Product Name",
  },
  {
    id: "sales_tax_percentage",
    numeric: false,
    disablePadding: false,
    label: "Sales Tax Percentage",
  },
  {
    id: "required_quantity",
    numeric: false,
    disablePadding: false,
    label: "Required Quantity",
  },
  {
    id: "unit_of_measurement",
    numeric: false,
    disablePadding: false,
    label: "Unit Of Measurement",
  },
  {
    id: "trade_price",
    numeric: false,
    disablePadding: false,
    label: "Trade Price",
  },
  {
    id: "trade_percentage",
    numeric: false,
    disablePadding: false,
    label: "Trade Discount %",
  },

  {
    id: "foc",
    numeric: false,
    disablePadding: false,
    label: "FOC",
  },
];
//
function createData(product_no, product_name, sales_tax_percentage) {
  return {
    product_no,
    product_name,
    sales_tax_percentage,
  };
}
//
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
//
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
//
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
//
function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <div />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
//

//

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
//

//
const CustomTable = ({ title, data, dataCollector }) => {
  const [dataState, setDataState] = useState([]);
  const handleInputFunction = (index, name, value) => {
    setDataState((pre) => {
      const temp = [...pre];
      temp[index] = {
        ...temp[index],
        [name]: value,
      };
      return temp;
    });
  };

  const [rows, setRow] = useState([]);
  const [filteredRow, setFilteredRow] = useState([]);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    var tempRows = data.map((item) => {
      return createData(item.id, item.product_name, item.sales_tax_percentage);
    });
    setRow(tempRows);
    setFilteredRow(tempRows);
  }, [data?.length]);

  const searchFunction = (value) => {
    setSearchData(value);
    setRow(
      filteredRow.filter((eachItem) => {
        if (searchData === "") return eachItem;
        return eachItem.product_name
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  useEffect(() => {
    setDataState([]);
    const productIds = [];
    if (data.length > 0) {
      data.forEach((item) => {
        productIds.push(item.id);
      });

      //
      async function fetcher() {
        return await axiosFunction({
          urlPath: "/product/product_conversion/",
          method: "POST",
          data: { ids: productIds },
        });
      }
      const asyncConverter = async () => {
        var item_conversion = await fetcher();
        data.forEach((item) => {
          setDataState((pre) => {
            return [
              ...pre,
              {
                product_no: item.id,
                product_name: item.product_name,
                sales_tax_percentage: item.sales_tax_percentage,
                manufacturer: item.manufacturer_name,
                required_quantity: "",
                unit_of_measurement: "",
                trade_price: "",
                trade_percentage: "",
                foc: false,
                isSelected: false,
                item_conversion: item_conversion.data
                  .map((conversion) => {
                    if (item.id == conversion.productId) {
                      return conversion.item_conversion;
                    }
                  })
                  .filter((conversion) => conversion != undefined),
              },
            ];
          });
        });
      };
      asyncConverter();
    }
  }, [data.length]);

  //

  //
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dataToSend, setDataToSend] = useState([]);
  //
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  //
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  //
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };
  //
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  //

  // console.log(dataToSend);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          dataCollector={dataCollector}
          dataToSend={dataState}
        /> */}
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          {selected.length > 0 ? (
            <>
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {selected.length} selected
              </Typography>
              <input
                value={searchData}
                className={styles.search_input}
                placeholder="Search Product"
                onChange={(e) => searchFunction(e.target.value)}
              />
            </>
          ) : (
            title
          )}

          {selected.length > 0 ? (
            <Tooltip title="Add to cart">
              <IconButton
                type="button"
                className={styles.add_btn}
                onClick={() => {
                  var flag = false;
                  const temp = dataState.filter((eachItem) => {
                    return eachItem.isSelected === true;
                  });
                  temp.forEach((item) => {
                    if (
                      item.required_quantity === "" ||
                      item.unit_of_measurement === ""
                    ) {
                      flag = true;
                    }
                  });
                  if (flag) {
                    alert("Please insert required quantity and uom!");
                  } else {
                    dataCollector(temp);
                  }
                }}
              >
                <span>Add to Cart</span>
                <span>
                  <IoMdAdd />
                </span>
              </IconButton>
            </Tooltip>
          ) : (
            // <Tooltip title="Search item">
            <input
              value={searchData}
              className={styles.search_input}
              placeholder="Search Product"
              onChange={(e) => searchFunction(e.target.value)}
            />
            // </Tooltip>
          )}
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody className={styles.table_body}>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.product_no);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.product_no)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.product_no}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => {
                            setDataState((pre) => {
                              const temp = [...pre];
                              temp[index] = {
                                ...temp[index],
                                isSelected: !dataState[index].isSelected,
                              };
                              return temp;
                            });
                            handleClick(event, row.product_no);
                          }}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.product_no}
                      </TableCell>
                      <TableCell align="left">{row.product_name}</TableCell>
                      <TableCell align="left">
                        {`${row.sales_tax_percentage}%`}
                      </TableCell>
                      <TableCell align="left">
                        <input
                          type="text"
                          name="required_quantity"
                          placeholder="Required Quantity"
                          value={dataState[index]?.required_quantity}
                          onChange={(e) =>
                            handleInputFunction(
                              index,
                              e.target.name,
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="left" className={styles.dropdown_cell}>
                        <InputTypeDropDown
                          type="text"
                          options={["Carton", "Box", "Pieces"]}
                          name={"unit_of_measurement"}
                          onChange={(name, value) => {
                            handleInputFunction(index, name, value);
                          }}
                          placeholder={"UOM"}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <input
                          type="text"
                          name="trade_price"
                          placeholder="Trade Price"
                          value={dataState[index]?.trade_price}
                          onChange={(e) => {
                            handleInputFunction(
                              index,
                              e.target.name,
                              e.target.value
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <input
                          type="text"
                          name="trade_percentage"
                          placeholder="Trade Price %"
                          value={dataState[index]?.trade_percentage}
                          onChange={(e) => {
                            handleInputFunction(
                              index,
                              e.target.name,
                              e.target.value
                            );
                          }}
                        />
                      </TableCell>

                      <TableCell align="left">
                        <Switch
                          checked={dataState[index]?.foc}
                          onClick={() => {
                            setDataState((pre) => {
                              const temp = [...pre];
                              temp[index] = {
                                ...temp[index],
                                foc: !dataState[index].foc,
                              };
                              return temp;
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default CustomTable;
