import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pb-4 flex items-center justify-between border-b border-gray-100">
        <Heading className="text-xl font-serif text-[#2C1E36] font-bold">Cart Items</Heading>
        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black">
          {items?.length ?? 0} {items?.length === 1 ? 'Treasure' : 'Treasures'}
        </span>
      </div>
      <Table className="border-none">
        <Table.Header className="border-none">
          <Table.Row className="text-[#C5A059] uppercase tracking-widest text-[8px] font-black border-none hover:bg-transparent">
            <Table.HeaderCell className="!pl-0 pb-4 uppercase">Manifestation</Table.HeaderCell>
            <Table.HeaderCell className="pb-4"></Table.HeaderCell>
            <Table.HeaderCell className="pb-4 uppercase text-center">Qty</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell pb-4 uppercase text-center">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right pb-4 uppercase">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body className="border-none">
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
