// src/components/organization.tsx

"use client";

import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";

interface ProductType {
  name: string;
}

interface AccountType {
  name: string;
  product: ProductType;
}

export interface OrganizationType {
  tradingName: string;
  managerName?: string;
  managerPhoto?: string;
  category?: string;
  account: AccountType[];
  organizationChildRelationship: OrganizationType[];
  collapsed?: boolean;
}

interface OrganizationProps {
  org: OrganizationType;
  onCollapse: () => void;
  collapsed: boolean;
}

function Organization({ org, onCollapse, collapsed }: OrganizationProps) {
  const childrenCount = org.organizationChildRelationship?.length ?? 0;
  const bgColor = "bg-white";

  return (
    <div
      className={`inline-block ${bgColor} p-4 rounded-xl border cursor-pointer`}
      onClick={onCollapse}
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {org?.managerPhoto ? (
              <img
                src={`http://localhost:8080/storage/${org.managerPhoto}`}
                alt={org.managerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"; // hide broken image
                  // e.currentTarget.parentElement.innerHTML = "🏢"; // show icon fallback
                }}
              />
            ) : (
              <span className="text-blue-600 text-lg">🏢</span>
            )}
          </div>

          {collapsed && childrenCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {childrenCount}
            </span>
          )}
        </div>
        <div>
          <p className="mr-2 text-sm font-semibold">{org.tradingName}</p>
          <p className="mr-2 text-sm font-semibold">{org?.managerName ? org.managerName : ''}</p>
        </div>
      </div>
    </div>
  );
}

interface NodeProps {
  o: OrganizationType;
  parent?: OrganizationType | null;
}

function Node({ o, parent }: NodeProps) {
  const [collapsed, setCollapsed] = React.useState<boolean>(!!o.collapsed);

  React.useEffect(() => {
    o.collapsed = collapsed;
  }, [collapsed, o]);

  const T: React.ElementType = parent
    ? TreeNode
    : (props: React.PropsWithChildren<{ label: React.ReactNode }>) => (
        <Tree
          {...props}
          lineWidth={"2px"}
          lineColor={"#ccc"}
          lineBorderRadius={"12px"}
        >
          {props.children}
        </Tree>
      );

  return collapsed ? (
    <T
      label={
        <Organization
          org={o}
          onCollapse={() => setCollapsed(false)}
          collapsed={collapsed}
        />
      }
    />
  ) : (
    <T
      label={
        <Organization
          org={o}
          onCollapse={() => setCollapsed(true)}
          collapsed={collapsed}
        />
      }
    >
      {(o.organizationChildRelationship ?? []).map((c) => (
        <Node key={c.tradingName} o={c} parent={o} />
      ))}
    </T>
  );
}

interface OrgChartProps {
  data: OrganizationType;
}

export default function OrgChart({ data }: OrgChartProps) {
    const isEmpty =
    !data ||
    (!data.tradingName &&
      (!data.organizationChildRelationship ||
        data.organizationChildRelationship.length === 0));

  if (isEmpty) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center text-gray-600 text-lg" dir="rtl">
        لا توجد بيانات لعرضها
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-100 min-h-screen overflow-auto">
      <Node o={data} />
    </div>
  );
}
