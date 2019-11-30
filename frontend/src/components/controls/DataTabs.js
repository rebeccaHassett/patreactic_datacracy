import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Statistics from "../Statistics";

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
    },
}));

const StyledDataTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        width: '6.5vw',
        minWidth: '6.5vw',
        justifyContent: 'center',
        itemAlign: 'center',
    },
}))(props => <Tab {...props} />);

export default function DataTabs(props) {
    const classes = useDataStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{width:'24vw'}} color="primary">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    tabItemContainerStyle={{width: '5%'}}
                    contentContainerStyle={{  display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', right: '10vw'}}
                    centered={true}
                >
                    <StyledDataTab label="State"/>
                    <StyledDataTab label="District" />
                    <StyledDataTab label="Precinct"/>
                </Tabs>
            </AppBar>
            <TabPane value={value} index={0}>
                <h4 style={{fontWeight: 'bold', textDecoration: 'underline'}}>Voting Incumbents:</h4>
                {/* <p>{props.incumbents}</p> */}
                <h4 style={{fontWeight: 'bold', textDecoration: 'underline'}}>Laws:</h4>
                <p>{props.laws}</p>
                <Statistics data={props.stateData}></Statistics>
            </TabPane>
            <TabPane value={value} index={1}>
                <Statistics data={props.districtData}></Statistics>
            </TabPane>
            <TabPane value={value} index={2}>
                <Statistics data={props.precinctData}></Statistics>
            </TabPane>
        </div>
    );
}
