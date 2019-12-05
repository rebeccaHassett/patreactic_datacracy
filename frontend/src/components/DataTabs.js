import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Statistics from "./Statistics";
import TableDisplay from "./controls/TableDisplay";
import Button from "@material-ui/core/Button";
import styled from "styled-components";


function TabPane(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPane.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useDataStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

const StyledDataTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        width: '12vw',
        minWidth: '12vw',
        justifyContent: 'center',
        itemAlign: 'center',
    },
}))(props => <Tab {...props} />);

export default function DataTabs(props) {
    const classes = useDataStyles();
    const [value, setValue] = React.useState(0);
    const [enableDistrictView, setEnableDistrictView] = React.useState(true);
    const [districtView, setDistrictView] = React.useState("View Original Districts");
    let  [,setState]=React.useState();
    const incumbent_columns = [
        { id: 'districtId', label: 'District', format: value => value.toLocaleString(),},
        { id: 'incumbent', label: 'Incumbent', format: value => value.toLocaleString(),},
    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDistrictView = (event) => {
        if(districtView === "View Original Districts") {
            setDistrictView("View Generated Districts");
            props.loadOriginalDistricts();
        }
        else {
            setDistrictView("View Original Districts");
            props.removeOriginalDistricts();
        }
    };

    if(props.generatedDistricts === false && enableDistrictView === true) {
        setEnableDistrictView(false);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ width: '35vw' }} color="primary">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    tabItemContainerStyle={{ width: '20%' }}
                    contentContainerStyle={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', right: '10vw'
                    }}
                    centered={true}
                >
                    <StyledDataTab label="State" />
                    <StyledDataTab label="District" />
                    <StyledDataTab label="Precinct" />
                </Tabs>
            </AppBar>
            <TabPane value={value} index={0}>
                <h4 style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Voting Incumbents:</h4>
                <TableDisplay columns={incumbent_columns} rows={props.incumbents}/>
                <h4 style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Laws:</h4>
                <p>{props.laws}</p>
                <Statistics data={props.stateData} type="state"></Statistics>
            </TabPane>
            <TabPane value={value} index={1}>
                <DistrictDataStyle>
                <Button variant="contained" color="primary"
                        style={{width: '25vw', marginBottom: '2vw',}} onClick={handleDistrictView}
                        disabled={enableDistrictView}>
                    {districtView}
                </Button>
                <Statistics data={props.districtData} type="district"></Statistics>
                </DistrictDataStyle>
            </TabPane>
            <TabPane value={value} index={2}>
                <Statistics data={props.precinctData} type="precinct"></Statistics>
            </TabPane>
        </div>
    );
}
const DistrictDataStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`