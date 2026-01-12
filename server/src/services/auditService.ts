import prisma from '../prisma';

export const logAudit = async (
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    details?: any,
    req?: any
) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                resourceType,
                resourceId,
                details: details || {},
                ipAddress: req?.ip || null,
                userAgent: req?.headers['user-agent'] || null
            }
        });
    } catch (error) {
        console.error("Audit Log Error:", error);
    }
};
