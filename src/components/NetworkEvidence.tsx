import type { Profile } from "../types.ts";
import {
  networkComponents,
  networkDestinations,
  networkGuideChecks,
} from "../data/week9Network.ts";
import { emptyNetwork, networkResult } from "../lib/network.ts";
import NetworkDiagram from "./NetworkDiagram.tsx";

export default function NetworkEvidence({ profile }: { profile: Profile }) {
  const network = profile.network ?? emptyNetwork();
  const latest = network.tests.at(-1);
  const result = latest && networkResult(latest);
  return (
    <section className="panel padded network-report">
      <h3>Week 9 network evidence</h3>
      <p>
        Guide checks passed {profile.practice?.passed.length ?? 0} of{" "}
        {networkGuideChecks.length}.
      </p>
      {latest && result ? (
        <div className="network-route-record">
          <h4>Latest tested route</h4>
          <p>
            {latest.source === "pc" ? "Classroom PC" : "Learner laptop"} ·{" "}
            {
              networkDestinations.find((target) => target.id === latest.target)
                ?.label
            }
          </p>
          <NetworkDiagram links={latest.links} path={result.reached} />
          <p className="network-route">{result.names.join(" → ")}</p>
          <p>
            {result.passed ? "Passed." : "Check required."} {result.message}
          </p>
          <p className="small muted">
            The diagram records the connections used at the time of this test.
          </p>
        </div>
      ) : (
        <p>Open College network and test a route to record it here.</p>
      )}
      <h4>Device descriptions</h4>
      <dl className="network-description-record">
        {network.descriptions.map((description, index) => (
          <div key={index}>
            <dt>
              {
                networkComponents.find(
                  (item) => item.id === description.component,
                )?.shortName
              }
            </dt>
            <dd>{description.text.trim() || "Description still to write."}</dd>
          </div>
        ))}
      </dl>
      <h4>My network explanation</h4>
      <p className="network-written-evidence">
        {profile.practice?.comparison.trim() ||
          "Open Lesson & evidence to write your explanation."}
      </p>
      <h4>Recorded network tests</h4>
      {network.tests.map((test) => {
        const outcome = networkResult(test);
        return (
          <div
            className="network-test-record"
            key={`${test.source}/${test.target}`}
          >
            <strong>
              {test.source === "pc" ? "Classroom PC" : "Learner laptop"} ·{" "}
              {
                networkDestinations.find((target) => target.id === test.target)
                  ?.label
              }{" "}
              · {outcome.passed ? "Passed" : "Check required"}
            </strong>
            <span className="small muted">
              {new Date(test.at).toLocaleString("en-GB")}
            </span>
            <p>{outcome.message}</p>
            <p>{outcome.names.join(" → ")}</p>
          </div>
        );
      })}
    </section>
  );
}
