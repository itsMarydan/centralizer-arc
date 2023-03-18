import Layout from "../layout";
import React from "react";
import {Tabs} from "antd";
import {RulesBoard} from "../componenets/authorization-components/rulesBoard";
import {PoliciesBoard} from "../componenets/authorization-components/policiesBoard";
import {RolesBoard} from "../componenets/authorization-components/roleBoard";


export function AuthorizationBoard() {


    const items = [
        { label: 'Roles', key: '1', children: <RolesBoard /> }, // remember to pass the key prop
        { label: 'Policies', key: '2', children: <PoliciesBoard />},
        { label: 'Rules', key: '3', children: <RulesBoard/> },

    ];
  return (
      <Layout>
          <div className="mt-2">
              <Tabs size={"large"} items={items} />
          </div>
      </Layout>
  );
}