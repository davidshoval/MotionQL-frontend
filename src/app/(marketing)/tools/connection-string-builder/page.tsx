import { ToolPage, type Faq } from "@/components/tools/tool-page";
import { ConnectionStringTool } from "@/components/tools/connection-string-tool";
import { toolMetadata } from "@/lib/tools/registry";

export const metadata = toolMetadata("connection-string-builder");

// Facts below follow the MongoDB connection string reference:
// https://www.mongodb.com/docs/manual/reference/connection-string/
const faqs: Faq[] = [
  {
    q: "What is the difference between mongodb:// and mongodb+srv://?",
    a: "mongodb:// lists every host and port yourself. mongodb+srv:// gives one DNS name; the driver looks up its SRV record to find the hosts and its TXT record for options such as replicaSet and authSource. The +srv form also turns TLS on by default and cannot include a port.",
  },
  {
    q: "How do I put special characters like @ or : in the password?",
    a: "Percent-encode them: @ becomes %40, : becomes %3A, / becomes %2F, # becomes %23. The builder does this for you, so type the password as-is in the Password field and copy the generated string.",
  },
  {
    q: "Which database does the user authenticate against?",
    a: "The authSource option if you set it, otherwise the database in the path (the part after the hosts), otherwise admin. Users for X.509, LDAP (PLAIN), Kerberos (GSSAPI), AWS and OIDC authentication live in $external.",
  },
  {
    q: "When should I use directConnection=true?",
    a: "When you want to talk to exactly one member of a replica set, for example a hidden secondary or a node behind an SSH tunnel, without the driver discovering and switching to the primary. It only works with a single host and not with mongodb+srv://.",
  },
  {
    q: "Is my connection string or password sent anywhere?",
    a: "No. Parsing and building happen in your browser with JavaScript; the page makes no network request with what you type. The password is masked on screen, and you choose whether to copy the masked or the real string.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="connection-string-builder"
      faqs={faqs}
      cta="Paste this connection string into MotionQL to connect: SRV, replica sets, sharded clusters, SSH jump hosts, X.509, LDAP, Kerberos, AWS IAM and OIDC are supported, and secrets stay encrypted with your OS keychain."
      about={
        <>
          <h2>Anatomy of a MongoDB connection string</h2>
          <p>
            <code>mongodb://user:password@host1:27017,host2:27017/defaultdb?replicaSet=rs0&amp;authSource=admin</code>
          </p>
          <ul>
            <li>
              <strong>Scheme</strong>: <code>mongodb://</code> for an explicit host list, or <code>mongodb+srv://</code> for a DNS seed
              list.
            </li>
            <li>
              <strong>Credentials</strong>: optional <code>user:password@</code>, percent-encoded.
            </li>
            <li>
              <strong>Hosts</strong>: one or more <code>host:port</code> pairs separated by commas. IPv6 addresses go in brackets.
            </li>
            <li>
              <strong>Default database</strong>: the path after the first <code>/</code>; also the default authentication database.
            </li>
            <li>
              <strong>Options</strong>: <code>key=value</code> pairs after <code>?</code>, joined with <code>&amp;</code>. Option names are
              case-insensitive.
            </li>
          </ul>
          <p>
            The checker flags what drivers reject or what commonly breaks a connection: ports on SRV hosts, unescaped characters in
            passwords, <code>directConnection</code> with several hosts, invalid option values and conflicting TLS settings. It does not
            resolve DNS or connect to your server.
          </p>
        </>
      }
    >
      <ConnectionStringTool />
    </ToolPage>
  );
}
