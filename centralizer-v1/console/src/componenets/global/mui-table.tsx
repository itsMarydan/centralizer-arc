import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {createTheme, lighten, makeStyles, Theme, ThemeProvider} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {APP_MESSAGES} from '../../static/app-messages';
import {BsFillPinAngleFill, BsTrashFill} from 'react-icons/bs'
import {useNavigate} from "react-router-dom";

function descendingComparator(a: any, b: any, orderBy: any) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
function getComparator(order: any, orderBy: any) {
    return order === 'desc'
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}
function stableSort(array: any, comparator: any) {
    const stabilizedThis = array.map((el: any, index: any) => [el, index]);
    stabilizedThis.sort((a: any, b: any) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el: any) => el[0]);
}
function EnhancedTableHead(props: any) {
    const {headCells, classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, hasSelector} = props;
    const createSortHandler = (property: any) => (event: any) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {hasSelector ? <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{'aria-label': 'select all desserts'}}
                    />
                </TableCell> : null}
                {headCells.map((headCell: any) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'right'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
EnhancedTableHead.propTypes = {
    headCells: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    hasSelector: PropTypes.bool
};
const useToolbarStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const SearchBar = (props: any) => {

    const {onSearch} = props;
    return (
        <div className="search-bar">
            <input placeholder={`search by slug`}  type="search" onChange={(e) => onSearch(e.target.value)} />
        </div>
    )
}
const EnhancedTableToolbar = (props: any) => {
    const classes = useToolbarStyles();
    const {numSelected, onSearch} = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
                    <>
                    {numSelected > 0 ? (
                        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                            {numSelected} selected
                        </Typography>
                    ) : null }

                        <SearchBar onSearch={onSearch} />
                   </>
        </Toolbar>
    );
};
const ActionItems = (props: any) =>{
    const classes = useToolbarStyles();
    const {handlePin,hasHandlePin, hasHandleDelete,handleDelete, selected, numSelected} = props;
    return(
        <>
            {numSelected > 0 ? (
                <div className='m-3'>
                    {hasHandlePin ? 
                                    <IconButton onClick={() => handlePin(selected)}>
                                        <BsFillPinAngleFill />
                                    </IconButton> : null
                    }

                    {hasHandleDelete ?
                        <IconButton onClick={() => handleDelete(selected)}>
                            <BsTrashFill />
                        </IconButton> : null
                    }

                </div>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">

                </Typography>
            )}
        </>
    )
}
ActionItems.propTypes = {
    numSelected: PropTypes.number.isRequired,
    handlePin: PropTypes.func,
    hasHandlePin: PropTypes.bool.isRequired,
    selected: PropTypes.array.isRequired,
    hasHandleDelete: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func
};
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSearch: PropTypes.func,
};

const theme = createTheme({
    palette: {
        primary: {
            light: '#0b79f6',
            main: '#0b79f6',
            dark: '#0b79f6',
            contrastText: '#fff',
        },
        secondary: {
            light: '#0b79f6',
            main: '#0b79f6',
            dark: '#0b79f6',
            contrastText: '#fff',
        },
    },
});
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    tableRow: {
        "&:hover": {
          backgroundColor: "rgb(218, 234, 253) !important"
        }
      }
}));

export default function EnhancedTable(props: any) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<any>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const navigate = useNavigate();
    // const rows = props.data;
    const [rows, setRows] = React.useState(props.data)
    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event: any) => {
        if (event.target.checked) {
            const newSelected = rows.map((n: any) => n[props.identifier]);
            setSelected(newSelected);
            console.log(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleClick = (event: any, identifier: any, navigate: any, url: string) => {

        navigate(`${url}/${identifier}`)
    };
    const handelCheckBox = (event: any, identifier: any) => {
        const selectedIndex = selected.indexOf(identifier);
        let newSelected: any[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, identifier);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
        console.log(newSelected);
    }
    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChangeDense = (event: any) => {
        setDense(event.target.checked);
    };

    function onSearch(search: any) {
        const filteredData = props.data.filter((data: any) =>
            data[props.identifier].toLowerCase().includes(search.toLowerCase()),
        );

        !search ? setRows(props.data) : setRows(filteredData);
    }
    const isSelected = (identifier: any) => selected.indexOf(identifier) !== -1;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    return (
        <ThemeProvider theme={theme}>
            <div
                className={classes.root}
            >
                <Paper
                    className={classes.paper}
                >
                    <EnhancedTableToolbar  onSearch={onSearch}  numSelected={selected.length}/>
                    <ActionItems hasHandleDelete={props.hasHandleDelete} handleDelete={props.handleDelete} hasHandlePin={props.hasHandlePin} selected={selected} handlePin={props.handlePin} numSelected={selected.length} />
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead headCells={props.headCells} classes={classes} numSelected={selected.length} order={order} orderBy={orderBy} onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={rows.length} hasSelector={props.hasSelector} />
                            {rows.length <=0 ?
                                    null
                                :
                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row: any, index: any) => {
                                            const isItemSelected = isSelected(row[props.identifier]);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (
                                                <TableRow
                                                    className={classes.tableRow}
                                                    hover={true}
                                                    onClick={(event: any) => handleClick(event, row[props.identifier], navigate, props.url)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={index}
                                                    selected={isItemSelected}
                                                >
                                                    {props.hasSelector ? <TableCell padding="checkbox">
                                                        <Checkbox
                                                            onClick={(event: any) => handelCheckBox(event, row[props.identifier])}
                                                            role="checkbox"
                                                            checked={isItemSelected}
                                                            inputProps={{'aria-labelledby': labelId}}
                                                        />
                                                    </TableCell> : null}
                                                    {props.headCells.map((cell: any, key: any) => (

                                                        <TableCell key={key} align="right">
                                                            {cell.id === "status" ?
                                                            <div className={row[cell.id] === "Published" ? "badge bg-success" : "badge bg-secondary"}>  {row[cell.id]}</div>
                                                           : <div> {row[cell.id]}</div>
                                                            }

                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>
                            }
                        </Table>
                    </TableContainer>

                    {rows.length <= 0 ?
                        <div>{APP_MESSAGES.NO_RESOURCE}</div>
                        :
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    }

                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense}/>}
                    label="Dense Padding"
                />
            </div>
        </ThemeProvider>
    );
}
