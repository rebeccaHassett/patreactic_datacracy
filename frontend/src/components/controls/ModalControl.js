import React from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

export default function ModalControl() {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} style={{width: '20vw', marginBottom: '2vw', backgroundColor: '#1E90FF'}}>
                Voting Bloc Table Display
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Voting Bloc Precincts</Modal.Title>
                </Modal.Header>
                <BootstrapTable className="vbdtoTable" /*data={ products }*/>
                    <TableHeaderColumn dataField='id' isKey={ true }>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'>Demographic</TableHeaderColumn>
                    <TableHeaderColumn dataField='price'>Population</TableHeaderColumn>
                    <TableHeaderColumn dataField='price'>Winning Party</TableHeaderColumn>
                    <TableHeaderColumn dataField='price'>Votes</TableHeaderColumn>
                    <TableHeaderColumn dataField='price'>Election Type</TableHeaderColumn>
                </BootstrapTable>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}