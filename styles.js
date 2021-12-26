/** @param {NS} ns **/

export const modalStyles = `
    .jj-modal {
        display: block;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    .jj-container {
        background-color: #102510;
        color: #40c040;
        border: 1px solid #409040;
        position: absolute;
        border-radius: 9px;
        font-family: arial;
        overflow: hidden;
        left: 0;
        right: 0;
        margin: auto;
        width: max-content;
        min-height: 640px;
        top: 20px;
        bottom: 20px;
    }

/* Modal Content */
    .jj-modal-content {
        height: 100%;
        padding: 20px;
        overflow: auto;
        position: relative;
        margin: 0 20px;
        left: 0;
        right: 0;
    }

    /* The Close Button */
    .close {
        position: absolute;
        color: #409040;
        float: right;
        right: 0;
        top: 0;
        font-size: 18px;
        font-weight: normal;
        font-family: system-ui;
        padding: 10px
    }

    .close:hover,
    .close:focus {
        color: #77cc77;
        text-decoration: none;
        cursor: pointer;
    }

    .jj-table {
        margin: 20px 0 80px;
    }

    .jj-title {
        color: #aaddaa;
        text-align: center;
    }

    .jj-header {
        height: 40px;
        background-color: #203520;
        width: 100%;
    }

    .table-header {
        height: 40px;
        color: #60e060;
    }

    .cell {
        padding: 0 20px;
    }

    .jj-header-title {
        position: absolute;
        color: #40c040;
        text-transform: uppercase;
        margin: 12px;
        text-align: center;
        right: 0;
        left: 0;
    }

    .row {
        height: 28px; 
    }

    .action {
        text-align: center;
    }
`;