MotionQL 1.7.1 connects to 66 databases and services. Each one is recognised when you connect (from the host name or what the server reports), and the connection's **Server type** setting overrides that.

**Depth:** *Deep* means the most complete support, with every MotionQL tool. *Good* means a complete everyday client: browse, query, edit, import and export, and Ask AI.

## MongoDB and compatible services

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| MongoDB | Deep | 27017 | Default for MongoDB connections. |
| MongoDB Atlas | Deep | 27017 | Host \*.mongodb.net. |
| Azure Cosmos DB for MongoDB (RU) | Good | 10255 | Host \*.mongo.cosmos.azure.com or \*.documents.azure.com, or server markers. |
| Azure DocumentDB | Good | 10260 | Host \*.mongocluster.cosmos.azure.com, or server markers. |
| Amazon DocumentDB | Good | 27017 | Host \*.docdb.amazonaws.com, or server markers. |
| Amazon DocumentDB elastic cluster | Good | 27017 | Host \*.docdb-elastic.amazonaws.com. |
| FerretDB | Good | 27017 | buildInfo reports ferretdb. |

## PostgreSQL and PostgreSQL-protocol servers

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| PostgreSQL | Deep | 5432 | Default for PostgreSQL connections. |
| Supabase | Good | 5432 | Host \*.supabase.co or \*.pooler.supabase.com, or the auth and storage schemas plus the anon and authenticated roles. |
| Neon | Good | 5432 | Host \*.neon.tech, or neon.\* settings. |
| TimescaleDB | Good | 5432 | The timescaledb extension, or host \*.tsdb.cloud.timescale.com. |
| Citus | Good | 5432 | The citus extension, or host \*.postgres.cosmos.azure.com. |
| Azure Database for PostgreSQL | Good | 5432 | Host \*.postgres.database.azure.com, or azure.\* settings or the azure_pg_admin role. |
| Amazon RDS for PostgreSQL | Good | 5432 | Host \*.rds.amazonaws.com, or rds.\* settings or the rdsadmin role. |
| Amazon Aurora PostgreSQL | Good | 5432 | The aurora_version() function, or an Aurora cluster host. |
| Amazon Redshift | Good | 5439 | version() contains Redshift. |
| CockroachDB | Good | 26257 | version() contains CockroachDB. |
| YugabyteDB | Good | 5433 | version() contains -YB-. |
| QuestDB | Good | 8812 | version() contains QuestDB. |
| RisingWave | Good | 4566 | version() contains RisingWave. |
| Materialize | Good | 6875 | version() contains Materialize, or the mz_version() function. |
| CrateDB | Good | 5432 | version() contains CrateDB. |

## MySQL and MariaDB

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| MySQL | Deep | 3306 | Default for MySQL connections. |
| Amazon RDS for MySQL | Good | 3306 | Host \*.rds.amazonaws.com, or a /rdsdbbin/ base directory. |
| Amazon Aurora MySQL | Good | 3306 | VERSION() contains mysql_aurora, or @@aurora_version. |
| MariaDB | Deep | 3306 | VERSION() contains MariaDB. |
| Amazon RDS for MariaDB | Good | 3306 | A MariaDB server with host \*.rds.amazonaws.com or a /rdsdbbin/ base directory. |
| Percona Server for MySQL | Good | 3306 | @@version_comment names Percona. |
| TiDB | Good | 4000 | VERSION() contains TiDB. |

## SQL Server

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| SQL Server | Deep | 1433 | Default for SQL Server connections. |
| Azure SQL | Good | 1433 | SERVERPROPERTY('EngineEdition') is 5 (Database) or 8 (Managed Instance), or host \*.database.windows.net. |

## Oracle

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Oracle | Good | 1521 | Default for Oracle connections. |
| Oracle Autonomous Database | Good | 1522 | SYS_CONTEXT('USERENV', 'CLOUD_SERVICE') or v$pdbs.cloud_identity, or host \*.oraclecloud.com. |

## SQLite

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| SQLite | Good | — | Default for SQLite files. |

## DuckDB

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| DuckDB | Good | — | Default for DuckDB files. |

## JDBC databases

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| IBM Db2 | Good | 50000 | Default for Db2 connections (JDBC bridge, IBM jcc driver). |
| Firebird | Good | 3050 | Default for Firebird connections (JDBC bridge, Jaybird driver). |
| H2 | Good | 9092 | Default for H2 connections (JDBC bridge, or H2's PostgreSQL server without Java). |
| HSQLDB | Good | 9001 | Default for HSQLDB connections (JDBC bridge). |
| Apache Derby | Good | 1527 | Default for Derby connections (JDBC bridge). |

## Redis and Valkey

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Redis | Good | 6379 | INFO server redis_version (also Dragonfly, KeyDB, ElastiCache, MemoryDB, Azure, Upstash and Redis Cloud by version fields or host). |
| Valkey | Good | 6379 | INFO server valkey_version or server_name:valkey. |

## ClickHouse

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| ClickHouse | Good | 8123 | Default for ClickHouse connections (HTTP interface; HTTPS when TLS is on). |

## Snowflake

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Snowflake | Good | 443 | Default for Snowflake connections. |

## Google BigQuery

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Google BigQuery | Good | 443 | Default for BigQuery connections; an emulator endpoint (goccy/bigquery-emulator) is recognised by its host. |

## Trino, PrestoDB and Starburst

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Trino | Good | 8080 | Default for Trino connections (GET /v1/info). |
| PrestoDB | Good | 8080 | The server refuses X-Trino-\* headers and answers with X-Presto-\* (or the connection is set to PrestoDB). |
| Starburst | Good | 443 | Host \*.galaxy.starburst.io, or a Starburst Enterprise version (e.g. 453-e.5). |

## Databricks SQL

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Databricks SQL | Good | 443 | Default for Databricks connections (AWS \*.cloud.databricks.com, Azure \*.azuredatabricks.net, GCP \*.gcp.databricks.com). |

## Google Cloud Spanner

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Google Cloud Spanner | Good | 443 | Default for Spanner connections (a GoogleSQL database); an emulator endpoint is recognised by its host. |
| Cloud Spanner (PostgreSQL) | Good | 443 | The database's databaseDialect is POSTGRESQL (read with the database on connect). |

## Elasticsearch and OpenSearch

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Elasticsearch | Good | 9200 | GET / version.number with no version.distribution (and the X-Elastic-Product header). |
| OpenSearch | Good | 9200 | GET / version.distribution "opensearch". |
| Elastic Cloud | Good | 443 | A Cloud ID, or a host under \*.elastic-cloud.com / \*.found.io. |
| Amazon OpenSearch Service | Good | 443 | A host under \*.es.amazonaws.com or \*.aoss.amazonaws.com (Serverless); AWS SigV4 sign-in. |

## Amazon DynamoDB

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Amazon DynamoDB | Good | 443 | The AWS regional endpoint; an endpoint URL on localhost:8000 is DynamoDB Local, :4566 LocalStack. |

## Apache Cassandra and ScyllaDB

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Apache Cassandra | Good | 9042 | Default for CQL connections; system.local release_version (DataStax Enterprise when it has dse_version; Astra with a secure connect bundle). |
| ScyllaDB | Good | 9042 | The system.versions table, which only ScyllaDB has. |

## InfluxDB

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| InfluxDB | Good | 8086 | Default for "InfluxDB 2.x / Cloud" connections: /ping X-Influxdb-Version 2.x with X-Influxdb-Build OSS (Flux, and InfluxQL through the v1 compatibility API). |
| InfluxDB Cloud | Good | 443 | A URL under \*.cloud2.influxdata.com, or X-Influxdb-Build Cloud. Untested against a live account (mocked in the unit tests). |
| InfluxDB 3 | Good | 8181 | Default for "InfluxDB 3" connections: /ping product_name InfluxDB 3 Core or Enterprise, version 3.x (SQL and InfluxQL over /api/v3/query_sql and /api/v3/query_influxql). |

## Neo4j and Memgraph (graph)

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Neo4j | Good | 7687 | Default for Bolt connections; dbms.components() gives the version and edition (Community or Enterprise). |
| Neo4j Aura | Good | 7687 | A host under \*.databases.neo4j.io (always neo4j+s://). |
| Memgraph | Good | 7687 | The Bolt server agent "Memgraph/…" (or SHOW STORAGE INFO answering where dbms.components() does not). |

## Cloud Firestore (Firebase)

| Database | Depth | Default port | Recognised by |
| --- | --- | --- | --- |
| Cloud Firestore | Good | 443 | Firestore connections (Firebase projects): Native mode databases, the default one or a named one; Datastore mode is refused on connect. |
| Firestore emulator | Good | 8080 | A Firestore connection with an emulator address (Firebase Local Emulator Suite, owner token). |

Planned: the open-source DocumentDB engine. Missing a database you use? Tell us on the [support page](/support).
