export function showHelp() {
  console.log(helpText);
}

export const helpText = `Wrapped CLI of 'bq' for interacting with BigQuery Emulator.


USAGE: bq-zx [--global_flags]<command> [--command_flags][args]


Any of the following commands:
  head, help, ls query, shell, show, version


head                       Displays rows in a table.

                           Examples:
                           bq head dataset.table
                           bq head -j job
                           bq head -n 10 dataset.table
                           bq head -s 5 -n 10 dataset.table

help                       Help for all or selected command:
                           bq.py help [<command>]

                           To retrieve help with global flags:
                           bq.py --help

                           To retrieve help with flags only from the main
                           module:
                           bq.py --helpshort [<command>]

ls                         List the objects contained in the named collection.

                           List the objects in the named project or dataset. A
                           trailing : or . can be used to signify a project or
                           dataset.
                           * With -j, show the jobs in the named project.
                           * With -p, show all projects.

                           Examples:
                           bq ls
                           bq ls -j proj
                           bq ls -p -n 1000
                           bq ls mydataset
                           bq ls -a
                           bq ls -m mydataset
                           bq ls --routines mydataset
                           bq ls --row_access_policies mytable (requires
                           whitelisting)
                           bq ls --filter labels.color:red
                           bq ls --filter 'labels.color:red labels.size:*'
                           bq ls --transfer_config --transfer_location='us'
                           --filter='dataSourceIds:play,adwords'
                           bq ls --transfer_run
                           --filter='states:SUCCESSED,PENDING'
                           --run_attempt='LATEST'
                           projects/p/locations/l/transferConfigs/c
                           bq ls --transfer_log
                           --message_type='messageTypes:INFO,ERROR'
                           projects/p/locations/l/transferConfigs/c/runs/r
                           bq ls --capacity_commitment --project_id=proj
                           --location='us'
                           bq ls --reservation --project_id=proj --location='us'
                           bq ls --reservation_assignment --project_id=proj
                           --location='us'
                           bq ls --reservation_assignment --project_id=proj
                           --location='us'
                           <reservation_id>
                           bq ls --connection --project_id=proj --location=us

query                      Execute a query.

                           Query should be specified on command line, or passed
                           on stdin.

                           Examples:
                           bq query 'select count(*) from
                           publicdata:samples.shakespeare'
                           echo 'select count(*) from
                           publicdata:samples.shakespeare' | bq query

                           Usage:
                           query [<sql_query>]

shell                      Start an interactive bq session.

show                       Show all information about an object.

                           Examples:
                           bq show -j <job_id>
                           bq show dataset
                           bq show [--schema]dataset.table
                           bq show [--view]dataset.view
                           bq show [--materialized_view]
                           dataset.materialized_view
                           bq show -m ds.model
                           bq show --routine ds.routine
                           bq show --transfer_config
                           projects/p/locations/l/transferConfigs/c
                           bq show --transfer_run
                           projects/p/locations/l/transferConfigs/c/runs/r
                           bq show --encryption_service_account
                           bq show --connection --project_id=project
                           --location=us connection
                           bq show --capacity_commitment
                           project:US.capacity_commitment_id
                           bq show --reservation --location=US
                           --project_id=project reservation_name
                           bq show --reservation_assignment --project_id=project
                           --location=US
                           --assignee_type=PROJECT --assignee_id=myproject
                           --job_type=QUERY
                           bq show --reservation_assignment --project_id=project
                           --location=US
                           --assignee_type=FOLDER --assignee_id=123
                           --job_type=QUERY
                           bq show --reservation_assignment --project_id=project
                           --location=US
                           --assignee_type=ORGANIZATION --assignee_id=456
                           --job_type=QUERY

version                    Return the version of bq.

Run 'bq.py --help' to get help for global flags.
Run 'bq.py help <command>' to get help for <command>.
`;
