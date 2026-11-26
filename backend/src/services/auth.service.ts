import prisma from "../lib/prisma";
import { verifyPassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
} from "../utils/token";

interface LoginInput {
  schoolCode: string;
  username: string;
  password: string;
}

export async function login(input: LoginInput) {
  const { schoolCode, username, password } = input;

  // 1. Find active school
  const school = await prisma.schools.findFirst({
    where: {
      school_code: schoolCode,
      status: "active",
    },
  });

  if (!school) {
    return null;
  }

  // 2. Find active user within the school
  const user = await prisma.users.findFirst({
    where: {
      school_id: school.id,
      username: username,
      status: "active",
    },
    include: {
      user_roles: {
        include: {
          roles: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  // 3. Verify password
  const isPasswordValid = await verifyPassword(
    password,
    user.password_hash
  );

  if (!isPasswordValid) {
    return null;
  }

  // 4. Extract assigned roles
  const roles = user.user_roles.map(
    (userRole) => userRole.roles.role_code
  );

  if (roles.length === 0) {
    return null;
  }

  // 5. Generate refresh token
  const refreshToken = generateRefreshToken();
  const expiresAt = getRefreshTokenExpiry();

  // 6. Create session and update last login
  const session = await prisma.$transaction(async (tx) => {
    const newSession = await tx.user_sessions.create({
      data: {
        school_id: school.id,
        user_id: user.id,
        token_hash: hashRefreshToken(refreshToken),
        expires_at: expiresAt,
      },
    });

    await tx.users.update({
      where: {
        id: user.id,
      },
      data: {
        last_login_at: new Date(),
      },
    });

    return newSession;
  });

  // 7. Generate access token
  const accessToken = generateAccessToken({
    userId: user.id,
    schoolId: school.id,
    sessionId: session.id,
  });

  // 8. Return authentication result
  return {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt: expiresAt,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      roles,
      schoolId: school.id,
      schoolCode: school.school_code,
      schoolName: school.name,
    },
  };
}

export async function refreshSession(refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);

  // 1. Find an active session
  const session = await prisma.user_sessions.findFirst({
    where: {
      token_hash: tokenHash,
      revoked_at: null,
      expires_at: {
        gt: new Date(),
      },
      users: {
        status: "active",
      },
      schools: {
        status: "active",
      },
    },
    include: {
      users: {
        include: {
          user_roles: {
            include: {
              roles: true,
            },
          },
        },
      },
    },
  });

  // 2. Reject invalid sessions
  if (!session) {
    return null;
  }

  const roles = session.users.user_roles.map(
    (userRole) => userRole.roles.role_code
  );

  if (roles.length === 0) {
    return null;
  }

  // 3. Generate a new refresh token
  const newRefreshToken = generateRefreshToken();

  // 4. Rotate the stored refresh token
  const updated = await prisma.user_sessions.updateMany({
    where: {
      id: session.id,
      token_hash: tokenHash,
      revoked_at: null,
      expires_at: {
        gt: new Date(),
      },
    },
    data: {
      token_hash: hashRefreshToken(newRefreshToken),
    },
  });

  // 5. Prevent concurrent reuse of the old token
  if (updated.count !== 1) {
    return null;
  }

  // 6. Generate a new access token
  const accessToken = generateAccessToken({
    userId: session.user_id,
    schoolId: session.school_id,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    refreshTokenExpiresAt: session.expires_at,
  };
}
export async function logoutSession(refreshToken: string) {
  // 1. Hash the refresh token
  const tokenHash = hashRefreshToken(refreshToken);

  // 2. Revoke the matching session
  const result = await prisma.user_sessions.updateMany({
    where: {
      token_hash: tokenHash,
      revoked_at: null,
    },
    data: {
      revoked_at: new Date(),
    },
  });

  // 3. Return whether a session was revoked
  return result.count > 0;
}