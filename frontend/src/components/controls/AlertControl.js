import React from 'react';
import {Alert, Button} from 'react-bootstrap';

export default function AlertControl() {
    const [show, setShow] = React.useState(true);

    if (show) {
        return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Phase 1 Requirement:</Alert.Heading>
                <p>
                    Must select at least one demographic group before running phase 1
                </p>
            </Alert>
        );
    }
    return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

