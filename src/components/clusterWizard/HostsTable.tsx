import React from 'react';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { EmptyState, ErrorState, LoadingState } from '../ui/uiState';
import { getColSpanRow } from '../ui/table/utils';
import { ResourceUIState } from '../../types';
import { Host } from '../../api/types';
import { Button, ButtonVariant } from '@patternfly/react-core';

type Props = {
  hosts?: Host[];
  uiState: ResourceUIState;
  fetchHosts: () => void;
  variant?: TableVariant;
};

const HostsTable: React.FC<Props> = ({ hosts = [], uiState, fetchHosts, variant }) => {
  // const headerStyle = {
  //   position: 'sticky',
  //   top: 0,
  //   background: 'white',
  //   zIndex: 1,
  // };
  const headerStyle = {};
  const headerConfig = { header: { props: { style: headerStyle } } };
  // TODO(jtomasek): Those should not be needed to define as they are optional,
  // needs fixing in @patternfly/react-table
  const columnConfig = {
    transforms: [],
    cellTransforms: [],
    formatters: [],
    cellFormatters: [],
    props: {},
  };
  const columns = [
    { title: 'ID', ...headerConfig, ...columnConfig },
    { title: 'Role', ...headerConfig, ...columnConfig },
    { title: 'Serial Number', ...headerConfig, ...columnConfig },
    { title: 'Status', ...headerConfig, ...columnConfig },
    { title: 'Status Info', ...headerConfig, ...columnConfig },
    { title: 'CPU', ...headerConfig, ...columnConfig },
    { title: 'Memory', ...headerConfig, ...columnConfig },
    { title: 'Disk', ...headerConfig, ...columnConfig },
  ];

  const hostToHostTableRow = (host: Host): string[] => {
    const { id, status, statusInfo } = host;
    return [id, 'Master', 'SN00000', status, statusInfo || '-', '-', '-', '-'];
  };

  // const hostRows = React.useMemo(() => hosts.map(hostToHostTableRow), [hosts]);
  const hostRows = hosts.map(hostToHostTableRow);

  const emptyState = (
    <EmptyState
      title="No hosts connected yet."
      content="Connect at least 3 hosts to your cluster to pool together resources and start running workloads."
      primaryAction={
        <Button variant={ButtonVariant.primary} onClick={() => alert('Hi!')}>
          Download discovery ISO
        </Button>
      }
    />
  );
  const errorState = <ErrorState title="Failed to fetch hosts" fetchData={fetchHosts} />;
  const loadingState = <LoadingState />;

  const getRows = () => {
    const columnCount = columns.length;
    switch (uiState) {
      case ResourceUIState.LOADING:
        return getColSpanRow(loadingState, columnCount);
      case ResourceUIState.ERROR:
        return getColSpanRow(errorState, columnCount);
      case ResourceUIState.EMPTY:
        return getColSpanRow(emptyState, columnCount);
      default:
        return hostRows;
    }
  };

  const rows = getRows();
  return (
    <Table
      rows={rows}
      cells={columns}
      variant={variant ? variant : rows.length > 5 ? TableVariant.compact : undefined}
      aria-label="Hosts table"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default HostsTable;
