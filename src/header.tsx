import * as React from 'react'
import type { CSSObject } from '@emotion/react'
import styled from '@emotion/styled'
import invariant from 'tiny-invariant'

import { useGridContextState, toPX } from './util'

function stickyStyle(value: string | undefined): CSSObject {
    if (value == null) return {}
    return {
        '> *': {
            position: 'sticky',
            top: `calc(var(--row-offset) + ${value})`,
            background: 'white',
        },
    }
}
const HeaderDiv = styled.div(({ sticky }: { sticky: string | undefined }) => ({
    display: 'contents',
    ...stickyStyle(sticky),
}))

const MissingHeader: React.FC<{ id: string }> = ({ id }) => (
    <span>Missing Renderer for column {id}</span>
)

export const Header = () => {
    const ctx = useGridContextState()

    const columns = React.useMemo(() => {
        if (!ctx?.currentLayout) return []
        const { renderers } = ctx
        return (ctx.currentLayout?.columns || []).map((col) => {
            const header = renderers[col.id]?.header
            invariant(header, `Missing Renderer for column ${col.id}`)
            return header ? (
                React.cloneElement(header, {
                    role: 'columnheader',
                    key: col.id,
                    id: col.id,
                    column: col,
                })
            ) : (
                <MissingHeader id={col.id} key={col.id} />
            )
        })
    }, [ctx])

    const top = ctx?.currentLayout?.stickyHeaderTop
    let sticky: string | undefined
    if (top != null && top !== false) {
        if (top === true) {
            sticky = '0px'
        } else {
            sticky = toPX(top)
        }
    }

    return (
        <HeaderDiv role="rowheader" sticky={sticky} className="grid-header">
            {columns}
        </HeaderDiv>
    )
}
